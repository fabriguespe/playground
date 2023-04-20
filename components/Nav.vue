<template>
<nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
      <a class="navbar-brand" href="/"><img width="50%" src="/favicon.png"/></a>
        <ul class="navbar-nav mr-auto d-flex flex-row">
        </ul>
        <div class="form-inline my-2 my-lg-0">
        </div>
      </div>
    </nav>
</template>


<style >
.navbar{
  margin-bottom: 40px;
}
.navbar::after{
  margin-bottom: 40px;
      height: 4px;
    position: absolute;
    top: 100%;
    right: 0px;
    left: 0px;
    background: linear-gradient(rgba(9, 30, 66, 0.13) 0px, rgba(9, 30, 66, 0.13) 1px, rgba(9, 30, 66, 0.08) 1px, rgba(9, 30, 66, 0) 4px);
    content: "";
}
.bg-light{
  background-color: white !important;
}
.nuxt-link-exact-active{
  font-weight: bold;
}
.loader {
  border: 6px solid #f3f3f3; /* Light grey */
  border-top: 6px solid #2C0969; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin:0 auto;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@media (max-width: 799px) {
  .navbar-nav li{
    margin-right: 10px;
  }
}
</style>