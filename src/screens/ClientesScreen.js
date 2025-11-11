import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { listClients } from '../api/clients';
import { fmtDate } from '../api/utils/format';

export default function ClientesScreen() {
  const nav = useNavigation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const handleBack = () => {
    if (nav.canGoBack()) nav.goBack();
    else nav.navigate('Dashboard'); // fallback
  };

  useEffect(() => {
    (async () => {
      try {
        const { items } = await listClients({ page: 1, perPage: 10 });
        setClients(items);
        console.log('📦 Clientes:', JSON.stringify(items, null, 2));
      } catch (e) {
        setErro(e.message);
        console.error('❌ Erro ao listar clientes:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>A carregar clientes…</Text>
      </View>
    );

  if (erro)
    return (
      <View style={s.center}>
        <Text style={{ color: 'red' }}>{erro}</Text>
      </View>
    );

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={handleBack} style={s.backBtn}>
        <Text style={s.backTxt}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.title}>Clientes</Text>
      <FlatList
        data={clients}
        keyExtractor={(c, i) => c.id || String(i)}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.info}>NIF: {item.vatNumber}</Text>
            <Text style={s.info}>Email: {item.email || '—'}</Text>
            <Text style={s.info}>Criado: {fmtDate(item.createdAt)}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f0e0c' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0e0c' },
  backBtn: { marginBottom: 10 },
  backTxt: { color: '#7ee081', fontWeight: '700', fontSize: 16 },
  title: { color: '#f5e6d3', fontWeight: '700', fontSize: 22, marginBottom: 12 },
  card: { backgroundColor: '#1b1916', padding: 12, borderRadius: 10, marginBottom: 10 },
  name: { color: '#f5e6d3', fontWeight: '700', fontSize: 16 },
  info: { color: '#cfc6bb', marginTop: 2 },
});
