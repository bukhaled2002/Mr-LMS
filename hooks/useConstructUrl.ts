export default function useConstructUrl(key: string) {
  console.log(process.env.NEXT_PUBLIC_AWS_REGION);
  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
}
