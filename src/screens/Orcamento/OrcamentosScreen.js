// src/screens/Orcamento/OrcamentosScreen.js
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadToken } from '../../api/api';
import { listBudgets } from '../../api/budgets';
import { fmtDate, fmtMoney } from '../../api/utils/format';

export default function OrcamentosScreen() {
  const nav = useNavigation();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    (async () => {
      try {
        await loadToken();
        const { items: data, pagination } = await listBudgets({ page, perPage: 20 });
        setItems((prev) => (page === 1 ? data : [...prev, ...data]));
        setHasMore(pagination.currentPage < pagination.lastPage);
        setErro('');
      } catch (e) {
        setErro(e?.message || 'Falha ao carregar orçamentos');
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => nav.navigate('OrcamentoDetalhe', { id: item.id })} activeOpacity={0.7}>
      <View style={s.card}>
        <Text style={s.top}>
          <Text style={s.topLeft}>{item.number}</Text>
          <Text style={s.topRight}>{fmtMoney(item.total)}</Text>
        </Text>

        <Text style={s.line}>NIF/Cliente: <Text style={s.val}>{item.clientName}</Text></Text>
        <Text style={s.line}>Estado: <Text style={s.badge}>{item.statusText}</Text></Text>
        <Text style={s.line}>Data: <Text style={s.val}>{fmtDate(item.date)}</Text></Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && items.length === 0) {
    return <View style={s.center}><ActivityIndicator size="large" /><Text style={{marginTop:8}}>A carregar…</Text></View>;
  }
  if (erro) {
    return <View style={s.center}><Text style={{color:'red'}}>{erro}</Text></View>;
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Orçamentos</Text>
      <FlatList
        data={items}
        keyExtractor={(it, i) => it.id || String(i)}
        renderItem={renderItem}
        onEndReached={() => hasMore && setPage((p) => p + 1)}
        onEndReachedThreshold={0.6}
        ListFooterComponent={loading ? <ActivityIndicator style={{marginVertical:12}}/> : null}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#0f0e0c' },
  center: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f0e0c' },
  title: { color:'#f5e6d3', fontWeight:'700', fontSize:22, marginBottom:12 },
  card: { backgroundColor:'#1b1916', padding:12, borderRadius:10, marginBottom:10 },
  top: { flexDirection:'row', justifyContent:'space-between' },
  topLeft: { color:'#f5e6d3', fontWeight:'700' },
  topRight: { color:'#f5e6d3', fontWeight:'700' },
  line: { color:'#cfc6bb', marginTop:2 },
  val: { color:'#eee', fontWeight:'600' },
  badge: { color:'#7ee081', fontWeight:'700' },
});
