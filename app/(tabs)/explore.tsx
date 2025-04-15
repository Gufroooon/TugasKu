// Tetap import semua seperti sebelumnya...
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TodoList() {
  const [mapel, setMapel] = useState("");
  const [judulTugas, setJudulTugas] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalTugas, setTotalTugas] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showCustomAlert = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [list]);

  useEffect(() => {
    loadTotalTugas();
  }, []);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(list));
    } catch (error) {
      console.log("gagal simpan:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
    } catch (error) {
      console.log("gagal load:", error);
    }
  };

  const saveTotalTugas = async (total) => {
    try {
      await AsyncStorage.setItem("totalTugas", JSON.stringify(total));
    } catch (error) {
      console.log("gagal simpan total tugas:", error);
    }
  };

  const loadTotalTugas = async () => {
    try {
      const savedTotal = await AsyncStorage.getItem("totalTugas");
      if (savedTotal !== null) {
        setTotalTugas(JSON.parse(savedTotal));
      }
    } catch (error) {
      console.log("gagal load total tugas:", error);
    }
  };

  const addTask = () => {
    if (mapel.trim() === "" || judulTugas.trim() === "") {
      showCustomAlert("Ada yang belum diisi nih!", "Isi dulu yang bener.");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: judulTugas.trim(),
      subject: mapel.trim(),
      deadline: deadline.toLocaleDateString(),
      done: false,
    };

    const updatedList = [...list, newTask];
    setList(updatedList);
    setMapel("");
    setJudulTugas("");
    setDeadline(new Date());

    const updatedTotal = updatedList.filter((t) => !t.done).length;
    setTotalTugas(updatedTotal);
    saveTotalTugas(updatedTotal);

    showCustomAlert("Tugas Baru Ditambahkan!", "Gasken beresin tugasnya!");
  };

  const deleteTask = (id) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);

    const updatedTotal = filtered.filter((t) => !t.done).length;
    setTotalTugas(updatedTotal);
    saveTotalTugas(updatedTotal);
  };

  const handleEdit = () => {
    if (mapel.trim() === "" || judulTugas.trim() === "") {
      showCustomAlert("Ada yang belum diisi nih!", "Pastikan semua kolom sudah terisi.");
      return;
    }

    const updated = list.map((item) =>
      item.id === editId
        ? {
          ...item,
          title: judulTugas.trim(),
          subject: mapel.trim(),
          deadline: deadline.toLocaleDateString(),
        }
        : item
    );
    setList(updated);
    setMapel("");
    setJudulTugas("");
    setDeadline(new Date());
    setIsEditing(false);
    setEditId(null);
    showCustomAlert("Tugas Diperbarui", "Perubahan berhasil disimpan.");
  };

  const startEdit = (item) => {
    setMapel(item.subject);
    setJudulTugas(item.title);
    setDeadline(new Date(item.deadline));
    setIsEditing(true);
    setEditId(item.id);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(Platform.OS === "ios" ? true : false);
    setDeadline(currentDate);
  };

  const markAsDone = (id) => {
    const updated = list.map((item) =>
      item.id === id ? { ...item, done: true } : item
    );
    setList(updated);

    const updatedTotal = updated.filter((t) => !t.done).length;
    setTotalTugas(updatedTotal);
    saveTotalTugas(updatedTotal);
    showCustomAlert("Wuish Kerenn!", "Mantap! Lanjutkan semangatnya 💪");
  };

  const screenWidth = Dimensions.get("window").width;

  const tugasAktif = list.filter((item) => !item.done);
  const tugasSelesai = list.filter((item) => item.done);

  return (
    <SafeAreaView style={tw`bg-[#f9fafb] h-full`}>
      <ScrollView>
        <View style={tw`px-5 pt-6 pb-10`}>
          <View style={tw`mb-6`}>
            <Text style={tw`text-3xl font-bold text-center text-blue-700`}>TugasKu 📚</Text>
            <Text style={tw`text-sm text-center text-gray-500 mt-1`}>Kelola semua tugas sekolahmu dengan mudah</Text>
          </View>

          <View style={tw`bg-white p-5 rounded-3xl shadow-md mb-8`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>📝 Form Tugas</Text>

            <View style={tw`mb-5`}>
              <Text style={tw`text-xs font-semibold text-gray-500 mb-2`}>Mata Pelajaran</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-2xl px-4 py-3 bg-gray-100`}
                placeholder="Contoh: Bahasa Inggris"
                value={mapel}
                onChangeText={setMapel}
              />
            </View>

            <View style={tw`mb-5`}>
              <Text style={tw`text-xs font-semibold text-gray-500 mb-2`}>Judul Tugas</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-2xl px-4 py-3 bg-gray-100`}
                placeholder="Contoh: PR Grammar Bab 3"
                value={judulTugas}
                onChangeText={setJudulTugas}
              />
            </View>

            <View style={tw`mb-5`}>
              <Text style={tw`text-xs font-semibold text-gray-500 mb-2`}>Deadline</Text>
              <TouchableOpacity
                style={tw`border border-gray-300 rounded-2xl px-4 py-3 bg-gray-100 flex-row justify-between items-center`}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={tw`text-gray-700`}>{deadline.toLocaleDateString()}</Text>
                <Ionicons name="calendar-outline" size={20} color="gray" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={deadline} mode="date" display="default" onChange={onDateChange} />
              )}
            </View>

            <TouchableOpacity
              style={tw`bg-blue-600 rounded-full py-3 mt-2`}
              onPress={isEditing ? handleEdit : addTask}
            >
              <Text style={tw`text-white text-center font-semibold text-base`}>
                {isEditing ? "💾 Simpan Perubahan" : "+ Tambah Tugas"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Daftar Tugas Aktif */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>📋 Daftar Tugas</Text>
            <Text style={tw`text-sm font-medium text-blue-600 mb-3`}>Total: {totalTugas} Tugas</Text>

            {tugasAktif.length === 0 ? (
              <View style={tw`bg-white p-5 rounded-2xl shadow-sm mb-6`}>
                <Text style={tw`text-center text-gray-500 text-base font-semibold`}>Belum ada tugas 🎉</Text>
                <Text style={tw`text-center text-gray-400 mt-1`}>Ayo mulai tambah tugas kamu!</Text>
              </View>
            ) : (
              tugasAktif.map((item) => (
                <View key={item.id} style={tw`bg-white p-4 mb-4 border border-gray-100 rounded-2xl shadow-sm`}>
                  <Text style={tw`text-xl font-bold text-blue-700`}>{item.subject}</Text>
                  <Text style={tw`text-base text-gray-800 mt-1`}>📝 {item.title}</Text>
                  <Text style={tw`text-sm text-gray-500 mt-1`}>⏰ Deadline: {item.deadline}</Text>

                  <View style={tw`flex-row justify-end mt-3`}>
                    <TouchableOpacity onPress={() => markAsDone(item.id)} style={tw`mr-4`}>
                      <Text style={tw`text-green-600 font-semibold`}>Selesai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => startEdit(item)} style={tw`mr-4`}>
                      <Text style={tw`text-blue-500 font-semibold`}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(item.id)}>
                      <Ionicons name="trash-outline" size={22} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Daftar Tugas Selesai */}
          <View>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>✅ Tugas Selesai</Text>
            {tugasSelesai.length === 0 ? (
              <View style={tw`bg-white p-5 rounded-2xl shadow-sm mb-6`}>
                <Text style={tw`text-center text-gray-500 text-base font-semibold`}>Belum ada tugas yang selesai 😴</Text>
                <Text style={tw`text-center text-gray-400 mt-1`}>Yuk selesaikan tugasmu satu per satu!</Text>
              </View>
            ) : (
              tugasSelesai.map((item) => (
                <View key={item.id} style={tw`bg-white p-4 mb-4 border border-gray-100 rounded-2xl`}>
                  <Text style={tw`text-base font-semibold text-green-700`}>{item.subject} - {item.title}</Text>
                  <Text style={tw`text-sm text-gray-500`}>Deadline: {item.deadline}</Text>
                  <TouchableOpacity onPress={() => deleteTask(item.id)} style={tw`mt-2 self-end`}>
                    <Ionicons name="trash-outline" size={22} color="red" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

        </View>
      </ScrollView>

      {/* Modal Alert */}
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={tw`flex-1 bg-black/30 justify-center items-center`}>
          <View style={tw`bg-white w-4/5 p-6 rounded-3xl shadow-lg`}>
            <Text style={tw`text-lg font-bold text-blue-700 mb-2`}>{modalTitle}</Text>
            <Text style={tw`text-gray-700 text-base mb-4`}>{modalMessage}</Text>
            <TouchableOpacity style={tw`bg-blue-600 px-4 py-2 rounded-full self-end`} onPress={() => setModalVisible(false)}>
              <Text style={tw`text-white font-semibold`}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
