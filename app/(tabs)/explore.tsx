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
  Alert,
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
      Alert.alert("duh", "belom kamu isi");
      return;
    }

    if (mapel.trim().length < 3) {
      Alert.alert("Waduh", "yang bener isinya");
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
  };

  const deleteTask = (id) => {
    Alert.alert(
      "Yakin ingin hapus?",
      "Tugas ini akan hilang dari daftar.",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            const filtered = list.filter((item) => item.id !== id);
            setList(filtered);
  
            const updatedTotal = filtered.filter((t) => !t.done).length;
            setTotalTugas(updatedTotal);
            saveTotalTugas(updatedTotal);
          },
        },
      ]
    );
  };
  

  const handleEdit = () => {
    if (mapel.trim() === "" || judulTugas.trim() === "") {
      Alert.alert("duh", "belom kamu isi");
      return;
    }
  
    Alert.alert(
      "Yakin ingin simpan perubahan?",
      "Data tugas akan diupdate.",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Simpan",
          onPress: () => {
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
          },
        },
      ]
    );
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
      item.id === id ? { ...item, done: !item.done } : item
    );
    setList(updated);

    const updatedTotal = updated.filter((t) => !t.done).length;
    setTotalTugas(updatedTotal);
    saveTotalTugas(updatedTotal);
  };

  const tugasAktif = list;

  return (
    <SafeAreaView style={tw`bg-[#f9fafb] h-full`}>
      <ScrollView>
        <View style={tw`px-5 pt-6 pb-10`}>
          <View style={tw`mb-6`}>
            <Text style={tw`text-3xl font-bold`}>TugasKu 📚</Text>
          </View>

          <View
            style={[
              tw`mb-5 bg-neutral-300 border border-neutral-400 rounded-lg`,
              {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
            ]}
          >
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-gray-100`}
              placeholder="Mapelnya apa tu?"
              value={mapel}
              onChangeText={setMapel}
            />
          </View>

          <View
            style={[
              tw`mb-5 bg-neutral-300 border border-neutral-400 rounded-lg`,
              {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
            ]}
          >
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-gray-100`}
              placeholder="Ada tugas apa hari ini"
              value={judulTugas}
              onChangeText={setJudulTugas}
            />
          </View>

          <View style={tw`mb-5 flex-row items-center`}>
            <TouchableOpacity
              style={tw`flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 mr-2`}
            >
              <Text style={tw`text-gray-700`}>
                {deadline.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-[#1E3A8A] flex-row justify-center items-center mr-2`}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="white" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <TouchableOpacity
            style={[tw`rounded-lg py-3 mt-2`, { backgroundColor: "#1E3A8A" }]}
            onPress={isEditing ? handleEdit : addTask}
          >
            <Text style={tw`text-white text-center font-semibold text-base`}>
              {isEditing ? "💾 Simpan Perubahan" : "+ Tambah Tugas"}
            </Text>
          </TouchableOpacity>

          <View style={tw`mt-6 mb-4`}>
            <Text
              style={tw`text-lg font-semibold text-gray-800 mb-2`}
            >📋 Daftar Tugas</Text>
            <Text style={tw`text-sm font-medium text-blue-600 mb-3`}>
              Total: {totalTugas} Tugas
            </Text>

            {tugasAktif.length === 0 ? (
              <View style={tw`bg-white p-5 rounded-2xl shadow-sm mb-6`}>
                <Text style={tw`text-center text-gray-500 text-base font-semibold`}>
                  Belum ada tugas 🎉
                </Text>
                <Text style={tw`text-center text-gray-400 mt-1`}>
                  Ayo mulai tambah tugas kamu!
                </Text>
              </View>
            ) : (
              tugasAktif.map((item) => (
                <View
                  key={item.id}
                  style={tw`bg-white p-4 mb-4 border border-gray-100 rounded-2xl shadow-sm`}
                >
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text
                      style={[
                        tw`text-xl font-bold`,
                        { color: item.done ? "green" : "#1E3A8A" },
                      ]}
                    >
                      {item.done ? "✅ " : ""}{item.subject}
                    </Text>
                    <TouchableOpacity onPress={() => markAsDone(item.id)}>
                      <Ionicons
                        name={item.done ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={item.done ? "green" : "gray"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={tw`text-base text-gray-800 mt-1`}>
                    📝 {item.title}
                  </Text>
                  <Text style={tw`text-sm text-gray-500 mt-1`}>
                    ⏰ Deadline: {item.deadline}
                  </Text>

                  <View style={tw`flex-row justify-end mt-3`}>
                    <TouchableOpacity
                      onPress={() => startEdit(item)}
                      style={tw`mr-4`}
                    >
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
