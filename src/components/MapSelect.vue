<template>
  <div>
    <div>
      <GmapAutocomplete
        ref="gAutocomplete"
        class="el-input"
        @place_changed='setPlace'
        @input="addressManuallyChanged"
      />
    </div>
    <br>
    <GmapMap
      :center='center'
      :zoom='12'
      style='width:100%;  height: 400px;'
      @click="click"
    >
      <GmapMarker
        :position="markers.position"
        @click="center=markers.position"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  data () {
    return {
      center: { lat: 40.409264, lng: 49.867092 },
      currentPlace: null,
      markers: [],
      places: [],
      address: ''
    }
  },
  mounted () {
    this.geolocate()
  },
  methods: {
    setPlace (place) {
      this.currentPlace = place
      this.addMarker()

    },
    addMarker () {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        }
        this.markers = ({ position: marker })
        this.center = marker
        this.$emit('mapAddressData', {
          ...marker,
          address: this.$refs.gAutocomplete.$el.value
        })
        this.currentPlace = null
      }
    },
    click (e) {
      const marker = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      }
      this.markers = ({ position: marker })
      this.$emit('mapAddressData', {
        ...marker,
        address: 'map'
      })
      this.$refs.gAutocomplete.$el.value = ''
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        this.$emit('mapAddressData', {
          ...this.center,
          address: 'map'
        })
        this.markers = ({ position: this.center })
      })
    },
    addressManuallyChanged () {
      this.markers = {}
      this.$emit('mapAddressData', {
        lat: '',
        lng: '',
        address: '',
        currentAddress: this.$refs.gAutocomplete.$el.value
      })
    }
  },
}
</script>

<style>
input:focus-visible {
  outline: none;
}
</style>
