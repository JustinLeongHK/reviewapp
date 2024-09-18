"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserAvatar from "@/components/UserAvatar";
import "./styles.css";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MouseEventHandler, useState } from "react";

import { ListBulletIcon } from "@radix-ui/react-icons";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, ListOrderedIcon } from "lucide-react";
import { useSubmitPostMutation } from "./mutations";

export default function PostEditor() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
      ListItem,
      Placeholder.configure({
        placeholder: "Write your review here...",
      }),
    ],

    autofocus: true,
    immediatelyRender: false,
  });

  if (!editor) {
    return;
  }

  const handleDialogClose = (open: boolean) => {
    if (!open && !editorIsEmpty(editor.getHTML())) {
      setIsAlertDialogOpen(true);
    } else {
      setIsDialogOpen(open);
    }
  };

  const handleConfirmClose = () => {
    setIsAlertDialogOpen(false);
    setIsDialogOpen(false);
    editor.commands.clearContent();
  };

  const handleCancelClose = () => {
    setIsAlertDialogOpen(false);
  };

  return (
    <div className="relative flex flex-grow flex-col gap-2 rounded-2xl bg-secondary p-5 shadow-sm">
      <div className="flex gap-2">
        <UserAvatar avatarUrl={null} />

        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger>
            <div className="w-full cursor-pointer rounded-2xl bg-background px-2 py-3 hover:shadow-md">
              Brought a new product? Went to a new restaurant? ... Share your
              review with the world. 🌎️
            </div>
          </DialogTrigger>
          <DialogContent
            className="flex h-[500px] w-[90%] flex-col overflow-y-auto"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Your Review</DialogTitle>
            </DialogHeader>

            <EditorMenu editor={editor} setIsDialogOpen={setIsDialogOpen} />

            <ConfirmClose
              open={isAlertDialogOpen}
              onOpenChange={setIsAlertDialogOpen}
              onConfirm={handleConfirmClose}
              onCancel={handleCancelClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface ConfirmCloseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

const ConfirmClose = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: ConfirmCloseProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to leave ?</AlertDialogTitle>
          <AlertDialogDescription>
            The contents are not posted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface EditorProps {
  editor: Editor;
  setIsDialogOpen: (input: boolean) => void;
}

const EditorMenu = ({ editor, setIsDialogOpen }: EditorProps) => {
  const mutation = useSubmitPostMutation();

  function onSubmit(input: string) {
    mutation.mutate(input, {
      onSuccess: () => {
        setIsDialogOpen(false);
        editor.commands.clearContent();
      },
    });
  }

  return (
    <>
      <div className="flex gap-5 border-b-4 border-slate-200 pb-5">
        <button
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "text-primary" : ""}
        >
          <BoldIcon />
        </button>
        <button
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "text-primary" : ""}
        >
          <ItalicIcon />
        </button>
        <button
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "text-primary" : ""}
        >
          <ListBulletIcon className="size-[35px]" />
        </button>
        <button
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "text-primary" : ""}
        >
          <ListOrderedIcon className="size-[30px]" />
        </button>
        <Button
          disabled={editorIsEmpty(editor.getHTML()) ? true : false}
          className="ms-auto"
          onClick={() => {
            onSubmit(editor.getHTML());
          }}
        >
          Post
        </Button>
      </div>
      <EditorContent editor={editor} />
    </>
  );
};

function editorIsEmpty(str: string) {
  // Regular expression to match a string that only contains HTML tags
  const regex = /^<[^>]+>(<\/[^>]+>)*$/;

  return regex.test(str.trim());
}
