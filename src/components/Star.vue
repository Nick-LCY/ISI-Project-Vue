<template>
  <div>
    <ul class="star">
      <li v-for="item in chance" :class="item" v-bind:key="item"></li>   <!--根据数据循环创建li标签-->
    </ul>
  </div>
</template>

<script>
  export default {
    name: "star",
    data() {
      return {
      }
    },
    props:["num","stor"],
    computed: {
      chance(){

        let arr=[];
        while (this.num>arr.length){
          arr.push("off")
        }

        let  num=Math.floor(this.stor)
        let  res=(this.stor-num)*10
        let  newstar=arr.map((item,index)=>{
          if (num>index){
            return "on"
          } else {
            return "off"
          }
        })
        if (res>=5){
          newstar[num]="half"
        }
        return newstar
      }

    },
  }
</script>

<style scoped>
  .star li {
    width: 20px;
    height: 20px;
    float: left;
    list-style: none;
    background: url("../assets/star_off.png") no-repeat center/cover;
  }
  .star .on{
    background-image: url("../assets/star_on.png");
  }
  .star .half{
    background-image:url("../assets/star_half.png") ;
  }
</style>

