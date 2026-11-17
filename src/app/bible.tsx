import { BOOKS } from "@/components/books";
import kjvStrongs from "@/components/kjv-strongs.json";
import kjvData from "@/components/kjv.json";
import dictData from "@/components/strongs-dict.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
const KJV = kjvData as Record<string, { t: string; i?: boolean; r?: boolean }[][][]>;
const STRONGS = kjvStrongs as Record<string, { t: string; i?: boolean; r? :boolean; s?: string }[][][]>;
const DICT = dictData as Record<string, { w: string; x: string; p?: string; d?: string; k?: string }>;

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
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [menuVerse, setMenuVerse] = useState(0);
  const [strongs, setStrongs] = useState(false);
  const [word, setWord] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("highlights").then((s) => s && setHighlights(JSON.parse(s)));
  }, []);
  
  function paint(color: string) {
    const key = `${book} ${chapter}:${menuVerse}`;
    const next = { ...highlights };
    if (color) next[key] = color; else delete next[key];
    setHighlights(next);
    AsyncStorage.setItem("highlights", JSON.stringify(next));
    setMenuVerse(0);
  }

  useEffect(() => {
  const ch = (strongs ? STRONGS : KJV)[book]?.[chapter - 1] ?? [];
  setVerses(ch.map((parts, i) => ({ verse: i + 1, parts })));
  scrollRef.current?.scrollTo({ y: 0 }); setLoading(false);
}, [book, chapter, strongs]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return ( <View style={{ flex: 1 }}>
    <ScrollView ref={scrollRef} onScrollBeginDrag={() => setVerse(0)} style={{ padding: 16, paddingBottom: 100, backgroundColor: "#fff" }} contentContainerStyle={{ paddingTop: 50, paddingBottom: 100 }}>
      <Text onPress={() => setShowBooks(!showBooks)} style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
  {book} {chapter} (KJV)
</Text>
      <Text onPress={() => setStrongs(!strongs)} style={{ color: "#2a7", marginBottom: 8 }}>
  {strongs ? "Hide Strong's" : "Show Strong's"}
</Text>
      
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
        <Text key={v.verse} onLongPress={() => setMenuVerse(v.verse)} onLayout={(e) => (spots.current[v.verse] = e.nativeEvent.layout.y)} style={{ fontSize: 17, backgroundColor: highlights[`${book} ${chapter}:${v.verse}`], lineHeight: 26, marginBottom: 6, opacity: verse && v.verse !== verse ? 0.3 : 1 }}>
          <Text style={{ fontWeight: "bold" }}>{v.verse} </Text>
        {v.parts.map((p: any, k: number) => (
  <Text key={k} style={{ fontStyle: p.i ? "italic" : "normal", color: p.r ? "#c00" : undefined }}>
    {p.t}{strongs && p.s ? <Text onPress={() => setWord(p.s)} style={{ fontSize: 9, color: "#2a7", textAlignVertical: "top" }}> {p.s[0]}{+p.s.slice(1)}</Text> : null}
  </Text>
))}
        </Text>
      ))}
          </ScrollView>
          {word !== "" && DICT[word] && (
  <View style={{ position: "absolute", top: 80, left: 16, right: 16, backgroundColor: "#fff", borderRadius: 16, padding: 16, elevation: 8 }}>
    <Text style={{ fontSize: 14, color: "#2a7" }}>{word[0]}{+word.slice(1)}</Text>
    <Text style={{ fontSize: 28 }}>{DICT[word].w}</Text>
    <Text style={{ fontSize: 16, fontStyle: "italic", marginBottom: 8 }}>
      {DICT[word].x}{DICT[word].p ? ` (${DICT[word].p})` : ""}
    </Text>
    {DICT[word].d && <Text style={{ fontSize: 15, marginBottom: 8 }}>{DICT[word].d}</Text>}
    {DICT[word].k && <Text style={{ fontSize: 14, color: "#555" }}>KJV: {DICT[word].k}</Text>}
    <Text onPress={() => setWord("")} style={{ position: "absolute", top: 6, right: 8, fontSize: 22, padding: 8, zIndex: 10 }}>✕</Text>
  </View>
)}
          {menuVerse > 0 && (
  <View style={{ position: "absolute", bottom: 85, left: 16, right: 16, flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: "#fff", borderRadius: 30, padding: 12, elevation: 5 }}>
    {["#fff59d", "#a5d6a7", "#90caf9", "#f48fb1", "#ffcc80"].map((c) => (
      <Text key={c} onPress={() => paint(c)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c }} />
    ))}
    <Text onPress={() => paint("")} style={{ fontSize: 24 }}>✕</Text>
  </View>
)}
    {!showBooks && (
      <View style={{ position: "absolute", bottom: 15, left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#eee", borderRadius: 30, paddingHorizontal: 20, paddingVertical: 12 }}>
        <Text
          onPress={() => { const i = BOOKS.findIndex((b) => b.name === book); if (chapter > 1) setChapter(chapter - 1); else if (i > 0) { setBook(BOOKS[i - 1].name); setChapter(BOOKS[i - 1].chapters); } }}
          style={{ fontSize: 28 }}
        >‹</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{book} {chapter}</Text>
        <Text
          onPress={() => { const i = BOOKS.findIndex((b) => b.name === book); if (chapter < BOOKS[i].chapters) setChapter(chapter + 1); else if (i < BOOKS.length - 1) { setBook(BOOKS[i + 1].name); setChapter(1); } }}
          style={{ fontSize: 28 }}
        >›</Text>
      </View>
    )}
  </View>
);
}