import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import axios from "axios";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
        setLoading(true);
    setError(null);

    // Tambahkan baris ini sementara
    await new Promise(resolve => setTimeout(resolve, 3000));

    const response = await axios.get(
      'https://fakestoreapi.com/products'
    );

    setProducts(response.data);
    } catch (err) {
      setError("Gagal memuat produk. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const response = await axios.get(
        "https://fakestoreapi.com/products"
      );

      setProducts(response.data);
    } catch (err) {
      setError("Gagal memuat produk. Periksa koneksi internet.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter Search
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // =======================
  // LOADING
  // =======================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🛍️ ShopCatalog</Text>

        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />

          <Text style={styles.infoText}>
            Memuat daftar produk...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =======================
  // ERROR
  // =======================
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🛍️ ShopCatalog</Text>

        <View style={styles.center}>
          <Text style={styles.errorEmoji}>😥</Text>

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={fetchProducts}
          >
            <Text style={styles.retryText}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // =======================
  // SUCCESS
  // =======================
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ ShopCatalog</Text>

        <Text style={styles.subTitle}>
          Temukan produk favoritmu
        </Text>
      </View>

      {/* Search */}
      <TextInput
        placeholder="🔍 Cari produk..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            {filteredProducts.length} Produk Ditemukan
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>

            <Text style={styles.emptyTitle}>
              Produk tidak ditemukan
            </Text>

            <Text style={styles.emptyDesc}>
              Coba gunakan kata kunci lain.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              resizeMode="contain"
            />

            <View style={styles.cardInfo}>
              <Text
                numberOfLines={2}
                style={styles.cardTitle}
              >
                {item.title}
              </Text>

              <Text style={styles.category}>
                {item.category}
              </Text>

              <View style={styles.bottomRow}>
                <Text style={styles.price}>
                  ${item.price}
                </Text>

                <Text style={styles.rating}>
                  ⭐ {item.rating.rate}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
    paddingTop: 45,
  },

  header: {
    paddingHorizontal: 18,
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
  },

  subTitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#64748B",
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },

  listContainer: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },

  listHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },

  cardImage: {
    width: 90,
    height: 90,
    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
    lineHeight: 20,
  },

  category: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748B",
    textTransform: "capitalize",
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    backgroundColor: "#16A34A",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "bold",
    fontSize: 15,
  },

  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  infoText: {
    marginTop: 15,
    fontSize: 16,
    color: "#475569",
  },

  errorEmoji: {
    fontSize: 55,
    marginBottom: 12,
  },

  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },

  retryBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 70,
  },

  emptyEmoji: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    marginTop: 10,
  },

  emptyDesc: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
  },
});
