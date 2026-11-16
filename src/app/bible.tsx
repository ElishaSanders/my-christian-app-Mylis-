import { BOOKS } from "@/components/books";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";

export default function BibleScreen() {
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState(3);
  const [showBooks, setShowBooks] = useState(false);

  useEffect(() => {const ONE_CHAPTER: Record<string, number> = { Obadiah: 21, Philemon: 25, "2 John": 13, "3 John": 14, Jude: 25 };
const ref = ONE_CHAPTER[book] ? `${book}%201:1-${ONE_CHAPTER[book]}` : `${book}%20${chapter}`;
    fetch(`https://bible-api.com/${ref}?translation=kjv`)
      .then((res) => res.json())
      .then((data) => setVerses(data.verses))
      .finally(() => setLoading(false));
  }, [book, chapter]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#fff" }} contentContainerStyle={{ paddingTop: 50, paddingBottom: 100 }}>
      <Text onPress={() => setShowBooks(!showBooks)} style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        {book} {chapter} (KJV)
      </Text>
      <Text onPress={() => { if (chapter > 1) setChapter(chapter - 1); }} style={{ color: "#0a7ea4", fontSize: 18 }}>{"<"} Previous Chapter</Text>
      <Text onPress={() => { const i = BOOKS.findIndex((b) => b.name === book); if (chapter < BOOKS[i].chapters) setChapter(chapter + 1); else if (i < BOOKS.length - 1) { setBook(BOOKS[i + 1].name); setChapter(1); } }} style={{ color: "#0a7ea4", fontSize: 18 }}> Next Chapter {">"}</Text>
      {showBooks && BOOKS.map((b) => (
        <Text key={b.name} onPress={() => { setBook(b.name); setChapter(1); setShowBooks(false); }} style={{ fontSize: 18, paddingVertical: 6 }}>
          {b.name}
        </Text>
      ))}
      {verses.map((v) => (
        <Text key={v.verse} style={{ fontSize: 17, lineHeight: 26, marginBottom: 6 }}>
          <Text style={{ fontWeight: "bold" }}>{v.verse} </Text>
          {v.text.replace(/\n/g, " ").trim()}
        </Text>
      ))}
    </ScrollView>
  );
}