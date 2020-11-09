<template>
  <div>
    <div
      style="
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <div style="margin: auto">
        <h1>Your cordinates:</h1>
        <p>
          {{ mapOptions.center.lat }} Latitude,
          {{ mapOptions.center.lng }} Longtitude
        </p>
      </div>
    </div>
    <button
      v-on:click="hideHeatmap = !hideHeatmap"
      style="margin: 20px 0px 0px -550px"
    >
      Heat-map
    </button>
    <gmaps-map
      :options="mapOptions"
      style="width: 640px; height: 360px; margin: 40px auto"
    >
      <gmaps-marker
        v-for="(item, i) in marker"
        :key="i"
        :options="item.options"
      />

      <gmaps-polyline :path="path" />
      <gmaps-heatmap
        :items="items"
        :opacity="0.7"
        :maxIntensity="1"
        :dissipating="false"
        v-if="!hideHeatmap"
      />
    </gmaps-map>
    <div class="base-demo" style="width: 700px; margin: 20px auto">
      <vue-table-dynamic :params="params" ref="table"></vue-table-dynamic>
    </div>
    <div>
      <apexchart
        ref="chart"
        width="600"
        type="line"
        :options="options"
        :series="series"
        style="width: 640px; height: 360px; margin: 40px auto"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import VueTableDynamic from "vue-table-dynamic";
import { gmapsMap, gmapsMarker, gmapsPolyline, gmapsHeatmap } from "x5-gmaps";

export default {
  components: {
    VueTableDynamic,
    gmapsMap,
    gmapsMarker,
    gmapsPolyline,
    gmapsHeatmap,
  },
  data() {
    return {
      hideHeatmap: true,
      options: {
        chart: {
          id: "realtime",
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000,
            },
          },
          stroke: {
            curve: "smooth",
          },
        },

        xaxis: {
          categories: [],
        },
        title: {
          text: "Temperature",
          align: "left",
        },
      },
      series: [
        {
          name: "series-1",
          data: [],
        },
      ],
      time_xaxis: [],
      counter_teble: 1,
      mapOptions: {
        center: { lat: 0, lng: 0 },
        zoom: 12,
      },
      marker: [],
      check: 0,
      params: {
        data: [["Index", `Time`, `Latitude`, `Longitude`]],
        header: "row",
        border: true,
        pagination: true,
        pageSize: 5,
        pageSizes: [5, 10, 20, 50],
        sort: [1, 1],
        enableSearch: true,
      },
      path: [],
      items: [],
    };
  },

  created() {
    //connect to websocket

    var ws = new WebSocket("ws://localhost:1880");
    console.log(ws);
    ws.onopen = () => {
      console.log("Connection opened!");
    };
    ws.onmessage = function (e) {
      var data = JSON.parse(e.data);
      console.log(data);
      if (this.check == 0) {
        this.message = data[0]["lat"];
        this.mapOptions.center.lat = data[0]["lat"];
        this.mapOptions.center.lng = data[0]["lon"];
        this.marker = [
          {
            options: { position: { lat: data[0]["lat"], lng: data[0]["lon"] } },
          },
        ];

        this.items.push({ lat: data[0]["lat"], lng: data[0]["lon"] });
        this.path = [{ lat: data[0]["lat"], lng: data[0]["lon"] }];
        this.check = 1;
        var date = new Date(data[0]["timestamp"] * 1000).toLocaleString();
        //grahp option
        this.time_xaxis.push(date.split(",")[1]);
        this.options = {
          xaxis: {
            categories: this.time_xaxis,
          },
        };
        this.series[0]["data"].push(data[0]["lat"]);
        this.series = [
          {
            data: this.series[0]["data"],
          },
        ];
        this.params.data.push([
          this.counter_teble,
          date,
          data[0]["lat"],
          data[0]["lon"],
        ]);
        this.counter_teble = this.counter_teble + 1;
      } else if (data["name"] == 2103) {
        this.mapOptions.center.lat = data["lat"];
        this.mapOptions.center.lng = data["lon"];
        this.marker = [
          {
            options: { position: { lat: data["lat"], lng: data["lon"] } },
          },
        ];
        this.path.push({ lat: data["lat"], lng: data["lon"] });

        this.items = [{ lat: data["lat"], lng: data["lon"] }];
        date = new Date(data["timestamp"] * 1000).toLocaleString();
        //grahp option
        this.time_xaxis.push(date.split(",")[1]);
        console.log(this.options.xaxis.categories);
        this.options = {
          xaxis: {
            categories: this.time_xaxis,
          },
        };
        this.series[0]["data"].push(data["lat"]);
        this.series = [
          {
            data: this.series[0]["data"],
          },
        ];

        this.params.data.push([
          this.counter_teble,
          date,
          data["lat"],
          data["lon"],
        ]);
        this.counter_teble = this.counter_teble + 1;
      }
    }.bind(this);
  },
};
</script>