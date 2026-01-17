import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const NOTES_DIR = path.join(process.cwd(), "app", "content", "notes");

export type NoteFrontmatter = {
  title: string;
  date: string;
  description: string;
  cover?: string;
};

export type NoteListItem = {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover?: string;
  readingTime: string;
};

export function getAllNotes(): NoteListItem[] {
  const files = fs.readdirSync(NOTES_DIR);

  const notes = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const filePath = path.join(NOTES_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      description: data.description ?? "",
      cover: data.cover ?? "",
      readingTime: readingTime(content).text,
    };
  });

  // newest first
  return notes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNoteBySlug(slug: string) {
  const filePath = path.join(NOTES_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as NoteFrontmatter,
    content,
    readingTime: readingTime(content).text,
  };
}
