interface Window {
  echarts: typeof import('echarts') & {
    parseGeoJSON?: (json: any) => any;
  };
}