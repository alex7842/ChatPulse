import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { useDropzone } from "@uploadthing/react";
import { XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { z } from "zod";

const ProUploadFileModal = ({
  refetchUserDocs,
}: {
  refetchUserDocs: () => void;
}) => {
  const { data: session } = useSession();
  const userPlan = session?.user?.plan || "PRO";

  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(undefined);
    setUrl(e.target.value);
  };

  const { isLoading: isUrlUploading, mutateAsync: mutateAddDocumentByLink } =
    api.document.addDocumentByLink.useMutation();

  const {
    startUpload,
    permittedFileInfo,
    isUploading: isUploadthingUploading,
  } = useUploadThing("docUploader", {
    onClientUploadComplete: () => {
      toast.success("File uploaded successfully.");
    },
    onUploadError: () => {
      toast.error("Error occurred while uploading", {
        duration: 3000,
      });
    },
  });

  const uploadFile = async () => {
    if ((file && url) || (!file && !url)) {
      toast.error("Please upload a file or enter a URL.", {
        duration: 3000,
      });
      return;
    }
    try {
      if (file) {
        await startUpload([file]);
      } else if (url) {
        const urlSchema = z.string().url();
        try {
          urlSchema.parse(url);
        } catch (err) {
          toast.error("Invalid URL", {
            duration: 3000,
          });
          return;
        }

        const res = await fetch(url);
        const contentType = res.headers.get("Content-Type");
        if (contentType !== "application/pdf") {
          toast.error("URL is not a PDF", {
            duration: 3000,
          });
          return;
        }

        const fileName =
          res.headers.get("Content-Disposition")?.split("filename=")[1] ||
          url.split("/").pop();

        await mutateAddDocumentByLink({
          title: fileName ?? "Untitled",
          url,
        });

        toast.success("File uploaded successfully.", {
          duration: 3000,
        });
      }
      closeModal();
      setFile(undefined);
      setUrl("");
      refetchUserDocs();
    } catch (err: any) {
      console.log("error", err.message);

      toast.error(
        "Error occurred while uploading. Please make sure the PDF is accessible.",
        {
          duration: 3000,
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>
        <div className={cn(buttonVariants())}>
          Upload File (Pro)
        </div>
      </DialogTrigger>
      <DialogContent hideClose={true}>
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl">Upload File (Pro)</p>
          </DialogTitle>
          
          <>
            <p className="text-sm font-normal text-gray-500">
              As a Pro user, you can upload larger files and use advanced features.
            </p>

            <div className="mb-2" />

            <ProUploader
              permittedFileInfo={permittedFileInfo}
              setUrl={setUrl}
              setFile={setFile}
              file={file}
            />

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="mx-3 flex-shrink text-xs text-gray-500">
                OR
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div>
              <p>Import from URL</p>
              <p className="mb-2 text-xs font-normal text-gray-500">
                Your files are not stored, only the URL is retained. Supports Google Drive and Dropbox links.
              </p>

              <Input
                value={url}
                onChange={onUrlChange}
                placeholder="https://example.com/file.pdf"
                className="w-full"
              />
            </div>

            <div>
              <div className="my-3 flex items-center space-x-2">
                <Checkbox id="terms2" />
                <label
                  htmlFor="terms2"
                  className="text-sm font-medium leading-none"
                >
                  Use OCR for scanned documents
                </label>
              </div>
            </div>

            <div>
              <Button
                disabled={
                  (!file && !url) || isUploadthingUploading || isUrlUploading
                }
                className="mt-4 w-full"
                onClick={uploadFile}
              >
                {(isUploadthingUploading || isUrlUploading) && <Spinner />}
                Upload
              </Button>
            </div>
          </>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProUploadFileModal;

const ProUploader = ({
  setUrl,
  setFile,
  file,
  permittedFileInfo,
}: {
  setUrl: (url: string) => void;
  setFile: (file?: File) => void;
  file?: File;
  permittedFileInfo: any;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles || acceptedFiles.length !== 1 || !acceptedFiles[0]) {
        toast.error("Please upload a single file.", {
          duration: 3000,
        });

        return;
      }

      setUrl("");
      setFile(acceptedFiles[0]);
    },
    [setUrl, setFile],
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    disabled: !!file,
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // Increased to 50MB for Pro users
    multiple: false,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center gap-4 rounded-md border-[0.75px] border-gray-300 px-4 py-12"
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="my-5 flex items-center gap-2">
          <p>{file.name}</p>
          <XIcon
            onClick={() => setFile()}
            className="h-4 w-4 text-gray-500 hover:cursor-pointer"
          />
        </div>
      ) : (
        <>
          <p>Upload your PDF</p>
          <p className="text-sm text-gray-500">Single PDF up to 10MB</p>
        </>
      )}
    </div>
  );
};
