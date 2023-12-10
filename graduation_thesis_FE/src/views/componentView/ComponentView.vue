<template>
    <h1 class="clas">
        Helllo
    </h1>
    <v-bottom-sheet>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" text="Click Me"></v-btn>
        </template>

        <v-card
            title="Bottom Sheet"
            text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut, eos? Nulla aspernatur odio rem, culpa voluptatibus eius debitis dolorem perspiciatis asperiores sed consectetur praesentium! Delectus et iure maxime eaque exercitationem!"
        ></v-card>
    </v-bottom-sheet>
</template>

<script lang="ts"></script>

<style lang="scss">
@import url('./ComponentView.scss');
.clas {
    font-size: large;
}
</style>