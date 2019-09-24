<template>
 <div class="container">
   <!-- <p v-if="user"><a @click="logout">Logout</a></p> -->
   <h2>Clienti</h2>
   <div class="row">


        <div class="col s12">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">search</i>
          <input type="text" id="autocomplete-input" class="autocomplete" v-on:input="searchBarFunctionality(searchString)" v-model="searchString">
          <label for="autocomplete-input">Cauta clienti</label>
        </div>
      </div>
    </div>


  </div>
    <br><br><br>
  <div class="row">
        <ul class="collection" id="myUL">
    <li v-for="(client,index) in distinctClients" :key="index" class="collection-item">
      <!-- <img src="/assets/logo.jpg" alt="" class=""> -->
      <a href="#"><h4><router-link :to="{ name:'Client', params : {name:client.name} }">{{client.name}}</router-link></h4></a>
      <!-- <a href="#!" class="secondary-content"><i class="medium material-icons">arrow_forward</i></a> -->
    </li>
    
   
  </ul>

  </div>

 </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name:'Home',
  data(){
    return {
        products : [],
        clients : [],
        distinctClients : [],
        searchString : null,
        user: null,
        
    }
  }, 
  methods : {
    logout(){
            firebase.auth().signOut().then(()=>{
                this.$router.push({ name: 'Login' });
            })
    },
    selectDistinctClients(){
      
      let clients = this.clients;
      
      // looping through clients
      Array.from(clients).forEach(client => {
          // lowering cases and capitalizing the string 
          console.log(this.user.email);
          if(client.agent === this.user.email){
          this.distinctClients.push({'name': client.client.toLowerCase().charAt(0).toUpperCase() + client.client.slice(1), 'id' : client.id});
          }
      });
         // removing duplicates
      //  this.distinctClients = [...new Set(this.distinctClients)]; 
      this.distinctClients = this.removeDuplicates(this.distinctClients);
      this.distinctClients.sort();
      
    },
    searchBarFunctionality(input) {
        // Declare variables
        input = this.verifyStringForChars(input);
        var  filter, ul, li, a, i, txtValue;
        filter = input.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
          a = li[i].getElementsByTagName("a")[0];
          txtValue = a.textContent || a.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
          } else {
            li[i].style.display = "none";
          }
        }
  },
   removeDuplicates(array) {
  let uniq = {};
  return array.filter(obj => !uniq[obj.name] && (uniq[obj.name] = true))
  },
  verifyStringForChars(string){

            string =  string.normalize('NFKD').replace(/[^\w]/g, '');
            return string;

        },
  },
  async beforeCreate(){

  
  },
 async mounted(){
   
await fetch('https://72c578e3.ngrok.io/cortina/priceApp/prices').then(res => res.json())
.then(response => { 
console.log('Success, price list was imported');
this.products =  response;
 }).catch(error => console.error('Error:', error));



await fetch('https://72c578e3.ngrok.io/cortina/priceApp/clients').then(res => res.json())
.then(response => { 
console.log('Success, clients discount lists were imported');
this.clients = response;
this.selectDistinctClients();
localStorage.setItem('priceList', JSON.stringify(this.products));
localStorage.setItem('clientsList', JSON.stringify(this.clients));
 }).catch(error => console.error('Error:', error)); 
  },
  created(){
     firebase.auth().onAuthStateChanged((user)=>{

            if(user){
                this.user = user;
            } else { 
                this.user = null;
            }

        })
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
