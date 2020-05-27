import React, {useState, useEffect} from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
 
    async function loadRepositories() {
      const response = await api.get('repositories');
      setRepositories(response.data);
    }

    loadRepositories();
    
  }, []);

   function handleLikeRepository(id) {    
    api.post(`repositories/${id}/like`)
      .then(response => {
        let newRepositories = [...repositories];
        let index = repositories.findIndex(repository => repository.id === id);          
        newRepositories[index] = {...newRepositories[index], likes: response.data.likes};
        setRepositories(newRepositories); 
      });
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
    
     <FlatList
         data={repositories}
         keyExtractor={repository => repository.id}
         renderItem={({item: repository}) => (
          <View style={styles.repositoryContainer} key={repository.id}>
            <Text style={styles.repository}>{repository.title}</Text>

           { repositories.length > 0 &&
            <View style={styles.techsContainer}>
              {repository.techs.map(tech => 
                <Text key={tech} style={styles.tech}>
                  {tech}
               </Text>)}
            </View>} 
            
            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                testID={`repository-likes-${repository.id}`}
                >
                { repository.likes + (repository.likes > 1 ? ' curtidas' : ' curtida')}
              </Text>
            </View>
                
            <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(repository.id)}
            testID={`like-button-${repository.id}`}
            >
            <Text style={styles.buttonText}>Curtir</Text>
          </TouchableOpacity>

          </View>
         )}
       />
       </SafeAreaView>
    </>);
}

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
