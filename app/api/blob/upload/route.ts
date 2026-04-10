import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('uploads/')) {
          throw new Error('INVALID_PATHNAME')
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
          }),
        }
      },
      onUploadCompleted: async () => {
        return
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message === 'INVALID_PATHNAME'
          ? 'The upload path is not allowed.'
          : error.message
        : 'An error occurred while generating the Blob upload token.'

    return NextResponse.json({ message }, { status: 400 })
  }
}
