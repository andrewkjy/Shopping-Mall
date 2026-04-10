'use client'

import { type ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { upload } from '@vercel/blob/client'

export default function BlobTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [blobUrl, setBlobUrl] = useState('')
  const [message, setMessage] = useState('Choose an image and upload it to verify the Blob connection.')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
    setBlobUrl('')
    setMessage(nextFile ? `${nextFile.name} selected.` : 'Choose an image and upload it to verify the Blob connection.')
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Select an image before uploading.')
      return
    }

    setIsUploading(true)
    setMessage('Uploading to Vercel Blob...')

    try {
      const blob = await upload(`uploads/${selectedFile.name}`, selectedFile, {
        access: 'public',
        handleUploadUrl: '/api/blob/upload',
      })

      setBlobUrl(blob.url)
      setMessage('Upload completed successfully.')
    } catch (error) {
      setBlobUrl('')
      setMessage(error instanceof Error ? error.message : 'An error occurred while uploading to Blob.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <PageShell>
      <Card>
        <Eyebrow>Storage Test</Eyebrow>
        <Title>Vercel Blob Upload Test</Title>
        <Description>
          This page uploads an image directly from the browser to Vercel Blob and returns a public URL.
        </Description>

        <FileInput type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileChange} />
        <UploadButton type="button" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload image'}
        </UploadButton>

        <Message $success={Boolean(blobUrl)}>{message}</Message>

        {blobUrl && (
          <PreviewCard>
            <PreviewImage src={blobUrl} alt="Uploaded image preview" />
            <UrlText>{blobUrl}</UrlText>
            <PreviewLink href={blobUrl} target="_blank" rel="noreferrer">
              Open in new tab
            </PreviewLink>
          </PreviewCard>
        )}
      </Card>
    </PageShell>
  )
}

const PageShell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%);
`

const Card = styled.section`
  width: min(100%, 680px);
  padding: 32px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #e7e5e4;
  box-shadow: 0 24px 64px rgba(28, 25, 23, 0.08);
`

const Eyebrow = styled.p`
  margin: 0;
  color: #57534e;
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 12px 0 0;
  color: #1c1917;
  font-size: clamp(2rem, 5vw, 3rem);
`

const Description = styled.p`
  margin: 16px 0 24px;
  color: #57534e;
  line-height: 1.7;
`

const FileInput = styled.input`
  display: block;
  width: 100%;
  margin-bottom: 16px;
  padding: 14px;
  border: 1px solid #d6d3d1;
  border-radius: 16px;
  background: #fafaf9;
`

const UploadButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #44403c, #1c1917);
  color: white;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`

const Message = styled.p<{ $success: boolean }>`
  margin: 16px 0 0;
  color: ${({ $success }) => ($success ? '#15803d' : '#b45309')};
  line-height: 1.6;
`

const PreviewCard = styled.div`
  margin-top: 24px;
  padding: 20px;
  border-radius: 20px;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
`

const PreviewImage = styled.img`
  display: block;
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 14px;
`

const UrlText = styled.p`
  margin: 16px 0 12px;
  color: #44403c;
  word-break: break-all;
`

const PreviewLink = styled.a`
  color: #1c1917;
  font-weight: 700;
  text-decoration: none;
`
