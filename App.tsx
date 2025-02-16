import { SupabaseClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from './services/supabase';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

export default function App() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      console.error(error);
    } else {
      setTasks(data);
    }
    setLoading(false);
  };

  const handleAddTask = async (task: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert({ task, completed: false });

    if (error) {
      console.error(error);
    } else {
      await fetchTasks();
    }
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .match({ id });

    if (error) {
      console.error(error);
    } else {
      await fetchTasks();
    }
  };

  const updateTask = async (id: number, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed })
      .match({ id });

    if (error) {
      console.error(error);
    } else {
      await fetchTasks();
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setEditingText(task.task);
  };

  const saveEditTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ task: editingText })
      .match({ id });

    if (error) {
      console.error(error);
    } else {
      setEditingTask(null);
      setEditingText("");
      await fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Adicione uma nova Tarefa
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite aqui..."
          onChangeText={(text) => setNewTask(text)}
          value={newTask}
        />
        <TouchableOpacity style={styles.button} onPress={() => handleAddTask(newTask)}>
          <Text style={styles.buttonText}>
            Adicionar
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text> Loading tasks... </Text>
      ) : (
        <ScrollView>
          {tasks.map((task: any) => (
            <View style={styles.task} key={task.id}>
              {editingTask && editingTask.id === task.id ? (
                <TextInput
                  style={styles.input}
                  value={editingText}
                  onChangeText={(text) => setEditingText(text)}
                />
              ) : (
                <Text style={[styles.textTask, task.completed && styles.completed]}>
                  {task.task}
                </Text>
              )}
              <View style={styles.iconContainer}>
                {editingTask && editingTask.id === task.id ? (
                  <TouchableOpacity onPress={() => saveEditTask(task.id)}>
                    <FontAwesome name="save" size={24} color="#28a745" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleEditTask(task)}>
                    <FontAwesome name="edit" size={24} color="#ffc107" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => updateTask(task.id, !task.completed)}>
                  <FontAwesome name="check" size={24} color="#17a2b8" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(task.id)}>
                  <FontAwesome name="trash" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f0f0f0',
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10, 
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    margin: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    borderRadius: 5,
  },
  task: {
    flexDirection: 'row', 
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textTask: {
    flex: 1,
    fontSize: 18,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#ccc',
  }, 
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});