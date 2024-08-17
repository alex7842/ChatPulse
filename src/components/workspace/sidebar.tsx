import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { useRef } from "react";
import { AlbumIcon, Download, Layers, MessagesSquareIcon, FileQuestion, Brush, ArrowLeft } from "lucide-react";
import { saveAs } from "file-saver";

import Chat from "@/components/chat";
import Editor from "@/components/editor";
import Flashcards from "@/components/flashcard";
import GenerateQuestions from "../GenarateQuestion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SpinnerPage } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomTooltip } from "@/components/ui/tooltip";
import { useBlocknoteEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import InviteCollab from "./invite-collab-modal";

const TABS = [
  {
    value: "notes",
    tooltip: "Take notes",
    icon: <AlbumIcon size={20} />,
    isNew: false,
  },
  {
    value: "chat",
    tooltip: "Chat with the pdf",
    icon: <MessagesSquareIcon size={20} />,
    isNew: false,
  },
  {
    value: "flashcards",
    tooltip: "Generate flashcards from the pdf",
    icon: <Layers size={20} />,
    isNew: false,
  },
  {
    value: "Generate Questions",
    tooltip: "Generate Questions and download",
    icon: <FileQuestion size={20} />,
    isNew: true,
  }
];

const tabNames = TABS.map((tab) => tab.value);

const DrawingTab: React.FC<{ setShowDrawingTab: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowDrawingTab }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  return (
    <div className="flex-1 overflow-scroll border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full">
      <div className="p-4">
        <button onClick={() => setShowDrawingTab(false)} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex flex-col gap-2 p-2">
  <h1 className="text-2xl font-bold">Tools</h1>
  <div className="flex gap-2 items-center">
    <button
      type="button"
      className={`px-3 py-1 text-sm rounded-md ${!eraseMode ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500'}`}
      disabled={!eraseMode}
      onClick={handlePenClick}
    >
      Pen
    </button>
    <button
      type="button"
      className={`px-3 py-1 text-sm rounded-md ${eraseMode ? 'bg-green-500 text-white' : 'border border-green-500 text-blue-500'}`}
      disabled={eraseMode}
      onClick={handleEraserClick}
    >
      Eraser
    </button>
    <div className="w-px h-6 bg-gray-300" />
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleUndoClick}
    >
      Undo
    </button>
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleRedoClick}
    >
      Redo
    </button>
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleClearClick}
    >
      Clear
    </button>
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleResetClick}
    >
      Reset
    </button>
  </div>
  <h1 className="text-2xl font-bold">Canvas</h1>
  <ReactSketchCanvas  width="100%"
        height="400px"
        canvasColor="transparent"
        strokeColor="#a855f7" ref={canvasRef} />
</div>

      </div>
    </div>
  );
};

const Sidebar = ({
  canEdit,
  username,
  isOwner,
  isVectorised,
}: {
  canEdit: boolean;
  username: string;
  isOwner: boolean;
  isVectorised: boolean;
}) => {
  const { query, push } = useRouter();
  const documentId = query?.docId as string;
  const tab = query.tab as string;
  const [showDrawingTab, setShowDrawingTab] = useState(false);
  const { editor } = useBlocknoteEditorStore();
  const [activeIndex, setActiveIndex] = useState(
    tab && tabNames.includes(tab) ? tab : "notes",
  );

  const handleDownloadMarkdownAsFile = async () => {
    if (!editor) return;
    const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    saveAs(blob, "notes.md");
  };

  useEffect(() => {
    if (tab && tabNames.includes(tab)) {
      setActiveIndex(tab);
    }
  }, [tab]);

  return (
    <div className="bg-gray-50">
      <Tabs
        value={activeIndex}
        onValueChange={(value) => {
          setActiveIndex(value);
          push(
            {
              query: {
                ...query,
                tab: value,
              },
            },
            undefined,
            { shallow: true },
          );
        }}
        defaultValue="notes"
        className="max-h-screen max-w-full overflow-hidden"
      >
        <div className="flex items-center justify-between pr-1">
          <TabsList className="h-12 rounded-md bg-gray-200">
            {TABS.map((item) => (
              <CustomTooltip content={item.tooltip} key={item.value}>
                <TabsTrigger value={item.value} className="relative">
                  {item.isNew && (
                    <div className="absolute -bottom-2 -right-2">
                      <Badge className="bg-blue-400 p-[0.05rem] text-[0.5rem] hover:bg-blue-500">
                        NEW
                      </Badge>
                    </div>
                  )}
                  {item.icon}
                </TabsTrigger>
              </CustomTooltip>
            ))}
          </TabsList>
          <div className="flex items-center gap-1">
            {isOwner && <InviteCollab />}
            <div
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "ml-auto cursor-pointer border-stone-200 bg-white px-2 text-xs shadow-sm sm:border",
              )}
              onClick={handleDownloadMarkdownAsFile}
            >
              <Download size={20} />
            </div>
          </div>
        </div>

        {[
          {
            value: "notes",
            tw: "flex-1 overflow-scroll border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll",
            children: (
              <RoomProvider
                id={`doc-${documentId}`}
                initialPresence={{}}
              >
                {!showDrawingTab ? (
                  <>
                  {/* for drawing */}
                    {/* <button onClick={() => setShowDrawingTab(true)} className="mb-4">
                      <Brush size={20} />
                    </button> */}
                    <ClientSideSuspense fallback={<SpinnerPage />}>
                      {() => (
                        <Editor
                          canEdit={canEdit ?? false}
                          username={username ?? "User"}
                        />
                      )}
                    </ClientSideSuspense>
                  </>
                ) : (
                  <DrawingTab setShowDrawingTab={setShowDrawingTab} />
                )}
              </RoomProvider>
            ),
          },
          {
            value: "chat",
            tw: " p-2 pb-0 break-words border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll ",
            children: <Chat isVectorised={isVectorised} />,
          },
          {
            value: "flashcards",
            tw: " p-2 pb-0 break-words border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll ",
            children: <Flashcards />,
          },
          {
            value: "Generate Questions",
            tw: " p-2 pb-0 break-words border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll ",
            children: <GenerateQuestions />,
          },
        ].map((item) => (
          <TabsContent
            key={item.value}
            forceMount
            hidden={item.value !== activeIndex}
            value={item.value}
            className={item.tw}
          >
            {item.children}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Sidebar;
