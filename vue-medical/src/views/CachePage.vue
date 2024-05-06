<template>
    <div>
        <div style="background-color: red;width:300px;height:300px">
        </div>
    </div>
</template>


<script>
export default {
    props: {
    emailForm: { type: Object,default: () => ({}) },
  },
  setup(props){
    console.log(props.emailForm)
    const test = '测试'

    return{test}
  }
  
}
</script>

<style>

</style>