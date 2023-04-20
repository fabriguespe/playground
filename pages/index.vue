<template>
  <body>
    <MyNav />
      <div  class="container text-center">
      <h5> XMTP Playground</h5>
      <template v-if="you"> wallet:{{you}}</template>
      <p>This is a playground for experimenting with all the xmtp features</p>
      
      <div class="d-flex p-3  text-white">
        <div class=" " style="width:50%">
            <form v-for="(c,index) in contacts" :key="index" @submit.prevent="sendMessageEvent($event,c)" id="person1-form">
              <label for="person1-input">{{c.name}}</label>
              <input  id="person1-input" type="text" placeholder="message">
              <input  id="person1-input" type="text" placeholder="conversationId">
              <button type="submit">Send</button>
            </form>
        </div>
        <div class=" " style="width:50%;color:black;">
            History Log<input type="checkbox" v-model="config.history" >
            Caching<input type="checkbox" v-model="config.caching" >
            <div ref="chatArea" class="chat-area" >
            <div v-if="loading" class="loader" width="10"></div>
              <p v-for="message in messages" class="message" :key="message.id" @click="printMsg(message)" :class="'message-'+message?.name?.toLowerCase()">
                {{ message.body }}
              </p>
            </div>

            <button class="mt10" @click="clearAllMessages">Clear All</button>
        </div>
      </div>
    </div>
  </body>
</template>


<script>

import { Client } from '@xmtp/xmtp-js'
import { Wallet } from 'ethers'
import { ref, nextTick } from 'vue'
import MyNav from '@/components/Nav'

export default {
   data() {
        return {
        config:{
          history:localStorage.getItem('history')=='true'?true:false,
          caching:localStorage.getItem('caching')=='true'?true:false,
        },
        contacts:[
          {"name":"You","address":"0xADADBEdf865355c553Db140D8425ea51A4DAC47C","privateKey":"0x28fd166a31d66807cc648b3156a148e60636d2b1f98b1f1452bc75224b0b3238"},
          {"name":"Bob","address":"0xCa299A324C9E4141d1e6b0C4dA4BbeB905450205","privateKey":"0x52844065dfda12c7b4b98e3f4c6e900dd714d1858d8a5d4b1fc465b1c8755062"},
          {"name":"Fabri","address":"0xfeF2D6A9469A3EdE34Eeb367062cebc8295aD9b1","privateKey":"0xcdc7af223e2298bd31a13e5d37c587e6840ba1a91bd155daffc010887f48938e"},
          {"name":"Matt","address":"0x1FA3fDfbCD91AC137A55Fdcd0F22CA7E7657023f","privateKey":"0x5ac46e8805a572f493181f434472c04a12515ffc632f36da5130465fcdc4834d"},
          {"name":"Paul","address":"0x15D5BC8AcA5fadbE547B50711490ac1D6553BFEa","privateKey":"0x9c8b406ec962d821e077451f3e490cc6329669c3bf076ddc11cb20e83e4e4627"}],
        xmtp:null,
        loading:false,
        wallet:'',
        messages: [],
        logs:[]
      }
    },

    async mounted(){
      try{
        this.loading=true
        this.wallet=this.contacts[0].address
        let cache=this.config.caching
        this.xmtp = await Client.create(new Wallet(this.contacts[0].privateKey), {
          persistConversations: cache
        })
        await this.helloWorld()
        this.messageListener()
        this.loading=false
      }catch(e){
        console.log(e)
      }
    },
    methods: {
          printMsg(message){
            alert(JSON.stringify(message))
          },
          async sendMessageEvent(event,author){
            let message=event.srcElement[0].value
            let conversationId=event.srcElement[1].value
            if(message.length==0 || author.length==0)alert('empty')
            else this.sendMessage(message,author,conversationId)
            
          },
          async sendMessage(msg,author,conversationId){
            this.loading=true
            msg={body: msg,author:author.address,name:author.name.toLowerCase()  ,conversationId:conversationId}
            for (const conversation of await this.xmtp.conversations.list()) {
              //console.log(conversation.peerAddress,author.address)
              if(conversation.peerAddress==author.address){
                await conversation.send(msg)
                this.messages.push(msg)
              this.loading=false
              }
            }
            nextTick(() => {
              let messageDisplay = this.$refs.chatArea
              messageDisplay.scrollTop = messageDisplay.scrollHeight
            })
          },
          async helloWorld(){
            const rooms = []
            try{  
              for (let i in this.contacts){
                let c_xmtp=this.contacts[i]

                let cache=this.config.caching
                await Client.create(new Wallet(c_xmtp.privateKey), {
                  persistConversations: cache
                })

                //Creates XMTP instances for each contact
                if(await this.xmtp.getUserContact(c_xmtp.address)){
                  const conversation=await this.xmtp.conversations.newConversation( c_xmtp.address)
                  await conversation.send('Hello world')
                  //completa si ya habia mensajes
                  if(this.config.history){
                    const messages = await conversation.messages()
                    for(let i in messages){
                      let message=messages[i]
                      if(!message.content)continue
                      this.addLog((messages[i]))
                      //this.messages.push({  body:message.content,author: message.senderAddress,name:c_xmtp.name ,conversationId:messages.conversationId}) 
                    }
                  }
                  this.messagesLoaded=true
                }
              }

              this.rooms = rooms
              this.rooms_loaded=true

            }catch(e){
              console.log(e)
            }
            
          },
          addLog(object){
            console.log(object)
          },
          async messageListener(){
            const stream = await this.xmtp.conversations.stream()
            for await (const conversation of stream) {
              this.addLog((conversation))
              console.log(`New conversation started with ${conversation.peerAddress}`)
              // Say hello to your new friend
              await conversation.send('Hi there!')
              // Break from the loop to stop listening
              break
            }
          },
          clearAllMessages() {
                this.messages = []
          }
    },
    computed:{
      you(){
        this.contacts[0].address
      },
    },
    watch:{
      config:{
        handler(val){
          localStorage.setItem('history',val.history)
          localStorage.setItem('caching',val.caching)
        },
        deep:true
      },
      messages(val){
        console.log(val)
      }
    },
    components:{
      MyNav
    }
}
</script>