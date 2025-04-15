import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function TodoList() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [list]);


  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(list));
      console.log("anjay berhasil");
    } catch (error) {
      console.log("gagal simpan:", error);
    }
  };

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
    };

    setList([...list, newTask]);
    setTask("");
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log("load data");
      }
    } catch (error) {
      console.log("gagal load:", error);
    }
  };

  const deleteTask = (id: string) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
  };

  const centang = (id) => {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
  };

  const handleEdit = () => {
    const updated = list.map((item) =>
      item.id === editId ? { ...item, title: task.trim() } : item
    );
    setList(updated);
    setTask("");
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (item: any) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View
        style={{
          position: "absolute",
          top: -160,
          left: screenWidth / 2 - 300,
          width: 600,
          height: 300,
          backgroundColor: "#FBBF24",
          borderBottomLeftRadius: 9999,
          borderBottomRightRadius: 9999,
          zIndex: -1,
        }}
      />


      <View style={tw`p-4 pt-32`}>
        <View style={tw`flex-row items-center mb-8`}>
          <Ionicons
            name="person-sharp"
            size={50}
            color="black"
            style={tw`mr-6`}
          />
          <Text style={tw`text-4xl font-extrabold text-gray-900`}>
            Personal
          </Text>
        </View>

        <View style={tw`flex-row items-center gap-2 mb-4`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 rounded-xl px-4 py-2 bg-white`}
            placeholder="Tambahkan tugas"
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity
            style={tw`bg-blue-500 px-4 py-2 rounded-xl`}
            onPress={isEditing ? handleEdit : addTask}
          >
            <Text style={tw`text-white font-semibold`}>Tambah</Text>

          </TouchableOpacity>
        </View>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`flex-row items-center justify-between p-4 mb-2 border-b border-gray-200`}>
              {/* Kiri: centang dan judul */}
              <TouchableOpacity
                style={tw`flex-row items-center`}
                onPress={() => centang(item.id)}
              >
                <View
                  style={tw`w-5 h-5 rounded border border-gray-400 mr-3 items-center justify-center ${item.completed ? "bg-green-500" : "bg-white"}`}
                >
                  {item.completed && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text style={tw`text-base text-black`}>{item.title}</Text>
              </TouchableOpacity>

              {/* Kanan: Edit & Hapus */}
              <View style={tw`flex-row items-center ml-auto`}>
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={tw`text-blue-500 mr-4`}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>

          )}
        />
      </View>
    </SafeAreaView>
  );
}
