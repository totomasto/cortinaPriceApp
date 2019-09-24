<template>
    <div class="login container">
        <!-- <h2 class="header center teal-text teal-darken-3">Login &#128540;</h2> -->
       
        <hr>
         <form @submit.prevent="login" class="card-panel">
             <div class="input-field col s12">
                <label for="email">Email:</label>
                <input type="email" name="email" class="validate" v-model="email">
            </div>
            <div class="input-field col s12">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <p class=" red-text center " v-if="feedback">{{feedback}}</p>
            
                <button class="btn btn-large waves-effect waves-light">Login</button>
        
        </form>
    </div>
    

</template>



<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    name : 'Login', 
    data(){
        return { 
            email: null, 
            password : null,
            feedback : null
        }
    },
    methods: {
        login(){
             if(this.email && this.password){

                this.feedback = null;

                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then((cred)=>{
                    this.$router.push({name:'Home'});
                })
                .catch((err)=>{
                    this.feedback = err.message;
                    console.error = err;
                })

            } else {
                this.feedback = 'Please fill in both fields';
            }
        }
    }
}
</script>



<style>
     .login { 
        max-width: 400px;
        margin-top: 100px;

    }

    

    .login .input-field{
        margin-bottom:25px;
        margin-top: 30px;
    }
</style>
