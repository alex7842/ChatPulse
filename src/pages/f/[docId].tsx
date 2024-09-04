import dynamic from "next/dynamic";
import { useRouter } from 'next/router';

const DynamicDocViewerPage = dynamic(
  (() => {
    const router = useRouter();
  const { d } = router.query;
  
  console.log('Demo value:', d);
    if (typeof window !== "undefined") {
      return import("@/components/workspace");
    }
  }) as any,
  { ssr: false },
);

export default DynamicDocViewerPage;
