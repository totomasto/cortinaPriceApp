<template>
    
    <div class="row">
        <h4>Lista pret pentru clientul cu numele: </h4><br>
        <h2><router-link :to="{name: 'Home'}">{{ clientName }}</router-link> </h2>
        <blockquote>*Click pe numele clientului pentru a reveni la lista clienti completa</blockquote>
        <br>
        <div class="col s12">
        <h3> Curs euro BT :  <input type="number" v-model="btEuroCurrency" @change="displayPriceList"> <button class="waves-effect waves-light btn-small" @click="init">Reactualizare curs BT</button> </h3>
        </div>
                <div class="container">
                <div class="col s12">
                <div class="input-field col s12">
                <i class="material-icons prefix">search</i>
                <input type="text" id="autocomplete-input" class="autocomplete" v-on:input="searchBarFunctionality(searchString)" v-model="searchString">
                <label for="autocomplete-input">Cauta produse</label>
                </div>

                <br><br>
          
                <ul class="collection" id="myUL">
                <li v-for="(article,index) in selectedPriceList" :key="index" class="collection-item">
                
                <h5><a>{{article.name}}</a></h5>
                <h4> {{article.price}}  &euro;  -  {{ (parseFloat(article.priceConverted) + parseFloat(article.priceTVA)).toFixed(2)  }}  RON cu TVA</h4>
                <p> 
                       {{article.description}}
                </p>
               
                </li>
                
            </ul>


          </div>
        </div>
    </div>
</template>



<script>
import $ from 'jquery'
export default {
    name:'Client', 
    data(){
        return { 
            clientName : null,
            clientsList : null, 
            priceList : null, 
            selectedPriceList : null,  
            searchString: null,
            btEuroCurrency : null, 
        }
    },
    methods : {
        init(){
            this.getBTEuroCurrency((err, eurCurrency)=>{
            this.btEuroCurrency = eurCurrency;
            this.clientName = this.$route.params.name
            this.clientsList  = JSON.parse(localStorage.getItem('clientsList'));
            this.priceList    = JSON.parse(localStorage.getItem('priceList'));
            this.displayPriceList();   
            // console.log(eurCurrency);
        });  
        },
        displayPriceList(){

            let clientDiscountGroup = [];
            let selectedPriceList = [];

            
            this.clientsList.forEach(client => {
                if(client.client == this.clientName){
                    
                        clientDiscountGroup.push({
                            'discountGroup' : client.grupa,
                            'discount' : client.discount,
                            'description' : client.description
                        });

                }
                
            });

        clientDiscountGroup.forEach((discount)=>{

            

            this.priceList.forEach((article)=>{

                if(discount.discountGroup == article.discount_group){

                        selectedPriceList.push({
                            'name': article.article,
                            'discountGroup' : discount.discountGroup,
                            'description' : discount.description,
                            'price' : (article.price - (discount.discount/100 * article.price)).toFixed(2),
                            'priceConverted' : (((article.price - (discount.discount/100 * article.price)).toFixed(2) * this.btEuroCurrency).toFixed(2)),
                            'priceTVA' : (((article.price - (discount.discount/100 * article.price)).toFixed(2) * this.btEuroCurrency * 19/100).toFixed(2)) 
                        });
            
                }

            })

        });    


         this.selectedPriceList = selectedPriceList;

        
         return
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
        async getBTEuroCurrency(callback){
             let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                // Action to be performed when the document is read;
                // console.log(xhttp.responseXML);
                let data = xhttp.responseXML.getElementsByTagName('exchangeRates');
                let eurValue;
                for (let i = 0; i< data.length; i++) {
                   eurValue = data[i].childNodes[1].childNodes[1].childNodes[0].childNodes[0].nodeValue;
                }
                
                this.btEuroCurrency = parseFloat(eurValue);
                // console.log(this.btEuroCurrency)
                callback(null, eurValue);
               
               }
            }
            xhttp.open("GET", "https://www.bancatransilvania.ro/jsn/exchange.php", true);
           await xhttp.send();
        
            
        },
        verifyStringForChars(string){

            string =  string.normalize('NFKD').replace(/[^\w]/g, '');
            return string;

        }
        
        

    },
    created(){

       this.init();
        

     // console.log(this.clientsList, this.priceList);
        
        
    }, 
     mounted(){
    
        
        // console.log(this.btEuroCurrency);
    }
}
</script>



<style>

</style>
