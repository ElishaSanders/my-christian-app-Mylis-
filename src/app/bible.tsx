import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";

export default function BibleScreen() {
    const [verses, setVerses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://bible-api.com/john%203?translation=kjv")
            .then((res) => res.json())
            .then((data) => setVerses(data.verses))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

    return (
       <ScrollView style={{ padding: 16, backgroundColor: "#fff" }} contentContainerStyle={{ paddingTop: 50, paddingBottom: 100 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          John 3 (KJV)
        </Text>
        {verses.map((v) => (
          <Text key={v.verse} style={{ fontSize: 17, lineHeight:26, marginBottom: 6 }}>
            <Text style={{ fontWeight: "bold" }}>{v.verse} </Text>
          {v.text.replace(/\n/g, " ").trim()}
        </Text>
      ))}
    </ScrollView>
  );
}