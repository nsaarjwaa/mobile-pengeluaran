import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const COLORS = {
  background: '#F7F8FC',
  card: '#FFFFFF',
  text: '#171A2B',
  secondary: '#6B7280',
  border: '#D8DCE8',
  button: '#12877F',
  buttonDark: '#0F746D',
  error: '#E53935',
  delete: '#C91C1C',
  disabled: '#EEF2F7',
  disabledText: '#6B7C98',
};

const categories = [
  'Makanan',
  'Transport',
  'Pendidikan',
  'Lainnya',
];

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number);
}

function getTodayDate() {
  const today = new Date();

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(today);
}

function Header({ title, subtitle, onBack, showBack = true }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitleRow}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {subtitle ? (
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function Button({
  title,
  onPress,
  color = COLORS.button,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? COLORS.disabled
            : color,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: disabled
              ? COLORS.disabledText
              : '#FFFFFF',
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  editable = true,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#777777"
        keyboardType={keyboardType}
        editable={editable}
        autoCorrect={false}
        autoCapitalize="sentences"
      />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

function ExpenseCard({ expense, onPress }) {
  return (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={onPress}
    >
      <View>
        <Text style={styles.expenseTitle}>
          {expense.title}
        </Text>

        <Text style={styles.expenseSmall}>
          Rp. {formatRupiah(expense.amount)}
        </Text>

        <Text style={styles.expenseSmall}>
          {expense.category}
        </Text>

        <Text style={styles.expenseSmall}>
          {expense.date}
        </Text>
      </View>

      <Text style={styles.detailLink}>
        Lihat detail →
      </Text>
    </TouchableOpacity>
  );
}

function ListScreen({
  expenses,
  onAdd,
  onDetail,
  onReload,
}) {
  const total = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Header
          title="Pengeluaran"
          subtitle="catatan pengeluaran kamu"
          showBack={false}
        />

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Total Pengeluaran
          </Text>

          <Text style={styles.totalValue}>
            Rp. {formatRupiah(total)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Daftar Pengeluaran
        </Text>

        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onPress={() => onDetail(expense)}
            />
          ))
        ) : (
          <View style={styles.emptyArea}>
            <Text style={styles.emptyText}>
              Belum Ada Pengeluaran
            </Text>
          </View>
        )}

        <View style={styles.bottomArea}>
          <Button
            title="+ Tambah Pengeluaran"
            onPress={onAdd}
          />

          <TouchableOpacity onPress={onReload}>
            <Text style={styles.reloadText}>
              ↻ Muat ulang
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AddScreen({
  title,
  amount,
  category,
  setTitle,
  setAmount,
  categoryOpen,
  setCategoryOpen,
  onSave,
  onBack,
  titleError,
  amountError,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          title="Tambah Pengeluaran"
          subtitle="Catat Pengeluaran Baru"
          onBack={onBack}
        />

        <FormInput
          label="Judul"
          value={title}
          onChangeText={setTitle}
          placeholder="Masukkan Judul"
          error={titleError}
        />

        <FormInput
          label="Nominal"
          value={amount}
          onChangeText={(value) =>
            setAmount(value.replace(/[^0-9]/g, ''))
          }
          placeholder="Masukkan Nominal"
          keyboardType="numeric"
          error={amountError}
        />

        <Text style={styles.label}>
          Pilih Kategori (Opsional)
        </Text>

        <TouchableOpacity
          style={styles.selectBox}
          onPress={() =>
            setCategoryOpen(!categoryOpen)
          }
        >
          <Text style={styles.selectText}>
            {category || 'Pilih kategori'}
          </Text>

          <Text style={styles.arrow}>
            ▼
          </Text>
        </TouchableOpacity>

        {categoryOpen && (
          <View style={styles.categoryDropdown}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.categoryItem}
                onPress={() => {
                  setCategory(item);
                  setCategoryOpen(false);
                }}
              >
                <Text style={styles.categoryText}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.formBottom}>
          <Text style={styles.serverText}>
            Tanggal diisi otomatis oleh server
          </Text>

          <Button
            title="Simpan"
            onPress={onSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CategoryScreen({
  onSelect,
  onBack,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Tambah Pengeluaran"
          subtitle="Catat Pengeluaran Baru"
          onBack={onBack}
        />

        <Text style={styles.label}>
          Pilih Kategori
        </Text>

        <View style={styles.categoryDropdownStatic}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.categoryItem}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.categoryText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function ErrorFormScreen({
  title,
  amount,
  category,
  setTitle,
  setAmount,
  setCategory,
  onSave,
  onBack,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          title="Tambah Pengeluaran"
          subtitle="Catat Pengeluaran Baru"
          onBack={onBack}
        />

        <FormInput
          label="Judul"
          value={title}
          onChangeText={setTitle}
          placeholder="Masukkan Judul"
          error="Judul wajib diisi"
        />

        <FormInput
          label="Nominal"
          value={amount}
          onChangeText={(value) =>
            setAmount(value.replace(/[^0-9]/g, ''))
          }
          placeholder="0"
          keyboardType="numeric"
          error="Nominal wajib diisi"
        />

        <Text style={styles.label}>
          Pilih Kategori (Opsional)
        </Text>

        <View style={styles.selectBox}>
          <Text style={styles.selectText}>
            {category || 'Pilih kategori'}
          </Text>

          <Text style={styles.arrow}>
            ▼
          </Text>
        </View>

        <View style={styles.formBottom}>
          <Text style={styles.serverText}>
            Tanggal diisi otomatis oleh server
          </Text>

          <Button
            title="Simpan"
            onPress={onSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SavingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centerScreen}>
        <Text style={styles.savingText}>
          Menyimpan...
        </Text>
      </View>
    </SafeAreaView>
  );
}

function DetailScreen({
  expense,
  onBack,
  onEdit,
  onDelete,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Header
          title="Detail Pengeluaran"
          subtitle="Informasi Pengeluaran"
          onBack={onBack}
        />

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>
            Judul
          </Text>
          <Text style={styles.detailValue}>
            {expense.title}
          </Text>

          <Text style={styles.detailLabel}>
            Nominal
          </Text>
          <Text style={styles.detailValue}>
            Rp. {formatRupiah(expense.amount)}
          </Text>

          <Text style={styles.detailLabel}>
            Kategori
          </Text>
          <Text style={styles.detailValue}>
            {expense.category}
          </Text>

          <Text style={styles.detailLabel}>
            Tanggal
          </Text>
          <Text style={styles.detailValue}>
            {expense.date}
          </Text>

          <Text style={styles.detailLabel}>
            Catatan
          </Text>
          <Text style={styles.detailValue}>
            {expense.note || '---'}
          </Text>
        </View>

        <Button
          title="Ubah"
          onPress={onEdit}
        />

        <Button
          title="Hapus"
          onPress={onDelete}
          color={COLORS.delete}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function EditScreen({
  expense,
  title,
  amount,
  setTitle,
  setAmount,
  onSave,
  onBack,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          title="Ubah Pengeluaran"
          subtitle="Edit Data Pengeluaran"
          onBack={onBack}
        />

        <FormInput
          label="Judul"
          value={title}
          onChangeText={setTitle}
          placeholder="Masukkan Judul"
        />

        <FormInput
          label="Nominal"
          value={amount}
          onChangeText={(value) =>
            setAmount(value.replace(/[^0-9]/g, ''))
          }
          placeholder="Masukkan Nominal"
          keyboardType="numeric"
        />

        <Text style={styles.label}>
          Kategori
        </Text>

        <View style={styles.inputDisabledBox}>
          <Text style={styles.disabledText}>
            {expense.category}
          </Text>
        </View>

        <Text style={styles.label}>
          Tanggal
        </Text>

        <View style={styles.inputDisabledBox}>
          <Text style={styles.disabledText}>
            {expense.date}
          </Text>
        </View>

        <Text style={styles.infoText}>
          Kategori dan tanggal tidak dapat diubah.
        </Text>

        <View style={styles.formBottom}>
          <Text style={styles.serverText}>
            Tanggal diisi otomatis oleh server
          </Text>

          <Button
            title="Simpan Perubahan"
            onPress={onSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DeleteConfirmScreen({
  expense,
  onCancel,
  onConfirm,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.confirmTitle}>
          Konfirmasi Hapus
        </Text>

        <Text style={styles.confirmQuestion}>
          Apakah kamu yakin ingin menghapus
          pengeluaran ini?
        </Text>

        <View style={styles.confirmCard}>
          <Text style={styles.expenseTitle}>
            {expense.title}
          </Text>

          <Text style={styles.expenseSmall}>
            Rp. {formatRupiah(expense.amount)}
          </Text>

          <Text style={styles.expenseSmall}>
            {expense.category}
          </Text>
        </View>

        <Button
          title="Batal"
          onPress={onCancel}
        />

        <Button
          title="Hapus"
          onPress={onConfirm}
          color={COLORS.delete}
        />
      </View>
    </SafeAreaView>
  );
}

function FailedScreen({
  onRetry,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Pengeluaran"
          subtitle="catatan pengeluaran kamu"
          showBack={false}
        />

        <View style={styles.emptyArea}>
          <Text style={styles.failedText}>
            Gagal Memuat Data
          </Text>

          <Text style={styles.failedDescription}>
            Terjadi kesalahan saat memuat
            daftar pengeluaran.
          </Text>
        </View>

        <Button
          title="↻ Coba lagi"
          onPress={onRetry}
        />
      </View>
    </SafeAreaView>
  );
}

function NotFoundScreen({
  onBack,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Pengeluaran"
          subtitle="Detail Pengeluaran"
          onBack={onBack}
        />

        <View style={styles.emptyArea}>
          <Text style={styles.emptyText}>
            Data Tidak Ditemukan
          </Text>

          <Text style={styles.failedDescription}>
            Pengeluaran tidak ditemukan atau
            telah terhapus.
          </Text>
        </View>

        <Button
          title="Kembali"
          onPress={onBack}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Bensin',
      amount: 15000,
      category: 'Transport',
      date: '13 September 2026',
      note: '---',
    },
    {
      id: 2,
      title: 'Buku Catatan',
      amount: 20000,
      category: 'Pendidikan',
      date: '16 September 2026',
      note: '---',
    },
  ]);

  const [screen, setScreen] = useState('list');

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');

  const [categoryOpen, setCategoryOpen] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const saveExpense = () => {
    let valid = true;

    if (title.trim() === '') {
      setTitleError('Judul wajib diisi');
      valid = false;
    } else {
      setTitleError('');
    }

    if (
      amount.trim() === '' ||
      Number(amount) <= 0
    ) {
      setAmountError('Nominal wajib diisi');
      valid = false;
    } else {
      setAmountError('');
    }

    if (!valid) {
      setScreen('error');
      return;
    }

    const automaticDate = getTodayDate();

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Lainnya',
      date: automaticDate,
      note: '---',
    };

    setScreen('saving');

    setTimeout(() => {
      setExpenses((previous) => [
        newExpense,
        ...previous,
      ]);

      setTitle('');
      setAmount('');
      setCategory('');
      setTitleError('');
      setAmountError('');

      setScreen('list');
    }, 1000);
  };

  const openDetail = (expense) => {
    setSelectedExpense(expense);
    setScreen('detail');
  };

  const openEdit = () => {
    if (!selectedExpense) return;

    setEditTitle(selectedExpense.title);
    setEditAmount(
      String(selectedExpense.amount)
    );

    setScreen('edit');
  };

  const saveEdit = () => {
    if (
      editTitle.trim() === '' ||
      editAmount.trim() === '' ||
      Number(editAmount) <= 0
    ) {
      return;
    }

    const updatedExpense = {
      ...selectedExpense,
      title: editTitle.trim(),
      amount: Number(editAmount),
    };

    setExpenses((previous) =>
      previous.map((item) =>
        item.id === selectedExpense.id
          ? updatedExpense
          : item
      )
    );

    setSelectedExpense(updatedExpense);
    setScreen('list');
  };

  const openDeleteConfirm = () => {
    setScreen('deleteConfirm');
  };

  const deleteExpense = () => {
    setExpenses((previous) =>
      previous.filter(
        (item) =>
          item.id !== selectedExpense.id
      )
    );

    setSelectedExpense(null);
    setScreen('list');
  };

  const chooseCategory = (item) => {
    setCategory(item);
    setCategoryOpen(false);
    setScreen('add');
  };

  if (screen === 'list') {
    return (
      <ListScreen
        expenses={expenses}
        onAdd={() => {
          setTitle('');
          setAmount('');
          setCategory('');
          setTitleError('');
          setAmountError('');
          setScreen('add');
        }}
        onDetail={openDetail}
        onReload={() => setScreen('list')}
      />
    );
  }

  if (screen === 'add') {
    return (
      <AddScreen
        title={title}
        amount={amount}
        category={category}
        setTitle={setTitle}
        setAmount={setAmount}
        categoryOpen={categoryOpen}
        setCategoryOpen={setCategoryOpen}
        onSave={saveExpense}
        onBack={() => setScreen('list')}
        titleError=""
        amountError=""
      />
    );
  }

  if (screen === 'category') {
    return (
      <CategoryScreen
        onSelect={chooseCategory}
        onBack={() => setScreen('add')}
      />
    );
  }

  if (screen === 'error') {
    return (
      <ErrorFormScreen
        title={title}
        amount={amount}
        category={category}
        setTitle={setTitle}
        setAmount={setAmount}
        setCategory={setCategory}
        onSave={saveExpense}
        onBack={() => setScreen('list')}
      />
    );
  }

  if (screen === 'saving') {
    return <SavingScreen />;
  }

  if (
    screen === 'detail' &&
    selectedExpense
  ) {
    return (
      <DetailScreen
        expense={selectedExpense}
        onBack={() => setScreen('list')}
        onEdit={openEdit}
        onDelete={openDeleteConfirm}
      />
    );
  }

  if (
    screen === 'edit' &&
    selectedExpense
  ) {
    return (
      <EditScreen
        expense={selectedExpense}
        title={editTitle}
        amount={editAmount}
        setTitle={setEditTitle}
        setAmount={setEditAmount}
        onSave={saveEdit}
        onBack={() => setScreen('detail')}
      />
    );
  }

  if (
    screen === 'deleteConfirm' &&
    selectedExpense
  ) {
    return (
      <DeleteConfirmScreen
        expense={selectedExpense}
        onCancel={() => setScreen('detail')}
        onConfirm={deleteExpense}
      />
    );
  }

  if (screen === 'failed') {
    return (
      <FailedScreen
        onRetry={() => setScreen('list')}
      />
    );
  }

  if (screen === 'notFound') {
    return (
      <NotFoundScreen
        onBack={() => setScreen('list')}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingTop: 10,
    paddingBottom: 20,
  },

  formContent: {
    paddingTop: 10,
    paddingBottom: 25,
  },

  header: {
    marginTop: 10,
    marginBottom: 14,
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 5,
    width: 20,
    alignItems: 'center',
  },

  backText: {
    fontSize: 27,
    fontWeight: '600',
    color: '#667085',
    lineHeight: 28,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 2,
  },

  totalCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 12,
    marginBottom: 13,
  },

  totalLabel: {
    fontSize: 12,
    color: COLORS.secondary,
  },

  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 1,
  },

  sectionTitle: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 10,
  },

  expenseCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    minHeight: 90,
    paddingHorizontal: 19,
    paddingVertical: 14,
    marginBottom: 12,
    justifyContent: 'space-between',
  },

  expenseTitle: {
    fontSize: 11,
    color: COLORS.text,
    marginBottom: 2,
  },

  expenseSmall: {
    fontSize: 9,
    color: COLORS.text,
    lineHeight: 12,
  },

  detailLink: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 5,
  },

  button: {
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },

  inputContainer: {
    marginBottom: 10,
  },

  label: {
    fontSize: 11,
    color: COLORS.text,
    marginBottom: 7,
  },

  input: {
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
  },

  inputError: {
    borderColor: COLORS.error,
  },

  inputDisabled: {
    backgroundColor: COLORS.disabled,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 9,
    marginTop: 3,
  },

  selectBox: {
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  selectText: {
    fontSize: 11,
    color: COLORS.text,
  },

  arrow: {
    fontSize: 10,
    marginLeft: 18,
    color: '#111111',
  },

  categoryDropdown: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    marginTop: 4,
    overflow: 'hidden',
  },

  categoryDropdownStatic: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
  },

  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  categoryText: {
    fontSize: 11,
    color: COLORS.text,
  },

  bottomArea: {
    marginTop: 105,
  },

  formBottom: {
    marginTop: 145,
  },

  serverText: {
    fontSize: 10,
    color: '#7083A1',
    marginBottom: 7,
  },

  reloadText: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.text,
    marginTop: 8,
  },

  detailCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 16,
    marginBottom: 19,
  },

  detailLabel: {
    fontSize: 11,
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 2,
  },

  detailValue: {
    fontSize: 10,
    color: COLORS.text,
    marginBottom: 17,
  },

  inputDisabledBox: {
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    backgroundColor: COLORS.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  disabledText: {
    fontSize: 11,
    color: COLORS.disabledText,
  },

  infoText: {
    fontSize: 9,
    color: '#7083A1',
    marginTop: -4,
  },

  emptyArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 350,
  },

  emptyText: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
  },

  failedText: {
    fontSize: 11,
    color: COLORS.error,
    textAlign: 'center',
  },

  failedDescription: {
    fontSize: 9,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 220,
  },

  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  savingText: {
    fontSize: 14,
    color: COLORS.text,
  },

  confirmTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 15,
  },

  confirmQuestion: {
    fontSize: 10,
    color: COLORS.text,
    marginBottom: 15,
  },

  confirmCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
});