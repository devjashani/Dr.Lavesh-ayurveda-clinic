import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { isRateLimited } from '@/lib/utils/rateLimit';

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB limit
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const REPORT_FOLDER = 'vankal-ayurveda/patient-reports';

function getCloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    '';
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim() || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() || '';
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim() || '';

  return {
    cloudName,
    apiKey,
    apiSecret,
    uploadPreset,
    hasSignedCreds: Boolean(cloudName && apiKey && apiSecret),
    hasUnsignedCreds: Boolean(cloudName && uploadPreset),
  };
}

/**
 * Generates a Cloudinary SHA-1 signature over alphabetically sorted params.
 */
function signCloudinaryParams(
  params: Record<string, string>,
  apiSecret: string
): string {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(`${sorted}${apiSecret}`).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limit per IP (15 uploads per minute)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (isRateLimited(`upload:${ip}`, 15, 60000)) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMITED',
          message: 'Too many upload requests. Please wait a moment.',
        },
        { status: 429 }
      );
    }

    // 2. Parse Multipart FormData
    const formData = await request.formData().catch(() => null);
    const file = formData?.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          code: 'MISSING_FILE',
          message: 'Please attach a PDF, JPG, PNG, or WEBP file.',
        },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_FILE_SIZE',
          message: `File "${file.name}" exceeds the 4MB upload limit.`,
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_FILE_TYPE',
          message: `File "${file.name}" must be a PDF, JPG, PNG, or WEBP image.`,
        },
        { status: 400 }
      );
    }

    const cfg = getCloudinaryConfig();

    // 3. Upload to Cloudinary (Signed or Unsigned Preset)
    if (cfg.hasSignedCreds || cfg.hasUnsignedCreds) {
      const cloudForm = new FormData();
      cloudForm.append('file', file);
      cloudForm.append('folder', REPORT_FOLDER);

      if (cfg.hasSignedCreds) {
        const timestamp = String(Math.floor(Date.now() / 1000));
        const signParams: Record<string, string> = {
          folder: REPORT_FOLDER,
          timestamp,
          unique_filename: 'true',
          use_filename: 'true',
        };
        const signature = signCloudinaryParams(signParams, cfg.apiSecret);

        cloudForm.append('api_key', cfg.apiKey);
        cloudForm.append('timestamp', timestamp);
        cloudForm.append('use_filename', 'true');
        cloudForm.append('unique_filename', 'true');
        cloudForm.append('signature', signature);
      } else {
        cloudForm.append('upload_preset', cfg.uploadPreset);
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cfg.cloudName)}/auto/upload`;
      const cloudRes = await fetch(uploadUrl, {
        method: 'POST',
        body: cloudForm,
      });

      const cloudJson = await cloudRes.json().catch(() => ({}));

      if (!cloudRes.ok || !cloudJson.secure_url) {
        const errMsg =
          cloudJson?.error?.message || `Cloudinary upload failed (HTTP ${cloudRes.status})`;
        console.error('[Cloudinary Upload Error]', errMsg);
        return NextResponse.json(
          {
            success: false,
            code: 'CLOUDINARY_UPLOAD_FAILED',
            message: errMsg,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        provider: 'cloudinary',
        url: cloudJson.secure_url as string,
        publicId: (cloudJson.public_id as string) || '',
        resourceType: (cloudJson.resource_type as string) || 'image',
        name: file.name,
      });
    }

    // 4. Fallback only if Cloudinary env vars are missing yet: attempt Supabase Storage,
    // otherwise return a clear Cloudinary configuration prompt.
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `reports/${Date.now()}_${sanitizedName}`;
    const arrayBuf = await file.arrayBuffer();

    const { data: sbData, error: sbErr } = await supabaseAdmin.storage
      .from('medical-reports')
      .upload(storagePath, Buffer.from(arrayBuf), {
        contentType: file.type,
        upsert: false,
      });

    if (!sbErr) {
      return NextResponse.json({
        success: true,
        provider: 'supabase-fallback',
        url: sbData?.path || storagePath,
        publicId: sbData?.path || storagePath,
        resourceType: 'raw',
        name: file.name,
      });
    }

    console.warn(
      '[Upload] Cloudinary credentials missing and Supabase fallback unavailable:',
      sbErr.message
    );
    return NextResponse.json(
      {
        success: false,
        code: 'CLOUDINARY_NOT_CONFIGURED',
        message:
          'Cloudinary upload is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to environment variables.',
      },
      { status: 503 }
    );
  } catch (err) {
    console.error('[Upload Route Error]', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'UPLOAD_ERROR',
        message: 'Could not upload file. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const publicId = typeof body?.publicId === 'string' ? body.publicId.trim() : '';
    const resourceType =
      body?.resourceType === 'raw' || body?.resourceType === 'video'
        ? body.resourceType
        : 'image';

    if (!publicId) {
      return NextResponse.json({ success: true });
    }

    // Security guard: allow deleting only newly uploaded files inside patient-reports folder
    if (publicId.startsWith(`${REPORT_FOLDER}/`)) {
      const cfg = getCloudinaryConfig();
      if (cfg.hasSignedCreds) {
        const timestamp = String(Math.floor(Date.now() / 1000));
        const signature = signCloudinaryParams(
          { public_id: publicId, timestamp },
          cfg.apiSecret
        );
        const destroyForm = new FormData();
        destroyForm.append('public_id', publicId);
        destroyForm.append('api_key', cfg.apiKey);
        destroyForm.append('timestamp', timestamp);
        destroyForm.append('signature', signature);

        await fetch(
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(cfg.cloudName)}/${resourceType}/destroy`,
          { method: 'POST', body: destroyForm }
        ).catch(() => {});
      }
    } else if (publicId.startsWith('reports/')) {
      await supabaseAdmin.storage.from('medical-reports').remove([publicId]).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
