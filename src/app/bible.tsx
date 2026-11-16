import { BOOKS } from "@/components/books";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function BibleScreen() {
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState(3);
  const [showBooks, setShowBooks] = useState(false);
  const [openBook, setOpenBook] = useState("");
  const [verse, setVerse] = useState(0);
  const [pickVerse, setPickVerse] = useState(false);
  const scrollRef = useRef<any>(null);
  const spots = useRef<Record<number, number>>({});

  useEffect(() => {const ONE_CHAPTER: Record<string, number> = { Obadiah: 21, Philemon: 25, "2 John": 13, "3 John": 14, Jude: 25 };
const ref = ONE_CHAPTER[book] ? `${book}%201:1-${ONE_CHAPTER[book]}` : `${book}%20${chapter}`;
    fetch(`https://bible-api.com/${ref}?translation=kjv`)
      .then((res) => res.json())
      .then((data) => setVerses(data.verses))
      .finally(() => setLoading(false));
  }, [book, chapter]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <ScrollView ref={scrollRef} onScrollBeginDrag={() => setVerse(0)} style={{ padding: 16, backgroundColor: "#fff" }} contentContainerStyle={{ paddingTop: 50, paddingBottom: 100 }}>
      <Text onPress={() => setShowBooks(!showBooks)} style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        {book} {chapter} (KJV)
      </Text>
      <Text onPress={() => { const i = BOOKS.findIndex((b) => b.name === book); if (chapter > 1) setChapter(chapter - 1); else if (i > 0) { setBook(BOOKS[i - 1].name); setChapter(BOOKS[i - 1].chapters); } }} style={{ color: "#0a7ea4", fontSize: 18 }}>{"<"} Previous Chapter</Text>
      <Text onPress={() => { const i = BOOKS.findIndex((b) => b.name === book); if (chapter < BOOKS[i].chapters) setChapter(chapter + 1); else if (i < BOOKS.length - 1) { setBook(BOOKS[i + 1].name); setChapter(1); } }} style={{ color: "#0a7ea4", fontSize: 18 }}> Next Chapter {">"}</Text>
      {pickVerse && (
  <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
    {verses.map((v) => (
      <Text key={v.verse} onPress={() => { setPickVerse(false); setVerse(v.verse); setTimeout(() => scrollRef.current?.scrollTo({ y: spots.current[v.verse] - 250, animated: true }), 100); }} style={{ width: 48, margin: 4, paddingVertical: 10, textAlign: "center", backgroundColor: "#333", color: "#fff", borderRadius: 8 }}>{v.verse}</Text>
    ))}
  </View>
)}
      {showBooks && BOOKS.map((b) => (
  <View key={b.name}>
    <Text onPress={() => setOpenBook(openBook === b.name ? "" : b.name)} style={{ fontSize: 18, paddingVertical: 6 }}>{b.name}</Text>
    {openBook === b.name && (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {Array.from({ length: b.chapters }, (_, n) => n + 1).map((c) => (
          <Text key={c} onPress={() => { setBook(b.name); setChapter(c); setShowBooks(false); setOpenBook(""); setPickVerse(true); }} style={{ width: 56, margin: 4, paddingVertical: 12, textAlign: "center", backgroundColor: "#333", color: "#fff", borderRadius: 8 }}>{c}</Text>
        ))}
      </View>
    )}
  </View>
))}
      {verses.map((v) => (
        <Text key={v.verse} onLayout={(e) => (spots.current[v.verse] = e.nativeEvent.layout.y)} style={{ fontSize: 17, lineHeight: 26, marginBottom: 6, opacity: verse && v.verse !== verse ? 0.3 : 1 }}>
          <Text style={{ fontWeight: "bold" }}>{v.verse} </Text>
          {v.text.replace(/\n/g, " ").trim()}
        </Text>
      ))}
    </ScrollView>
  );
}