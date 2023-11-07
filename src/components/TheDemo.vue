<script setup lang="ts">
import type { BuiltInSortingFn, RowData, SortingFn, SortingFns } from '@tanstack/vue-table';
import RcTable from './RcTable.vue';

type Image = {
  imageName: string
  tag: string
  imageID: string
  size: string
  digest: string
}

const images: Image[] = [
  {
    "imageName": "<none>",
    "tag": "<none>",
    "imageID": "92d1ae4d9fe4",
    "size": "5.09MB",
    "digest": "<none>",
  },
  {
    "imageName": "<none>",
    "tag": "<none>",
    "imageID": "9d12b7f77bf5",
    "size": "5.09MB",
    "digest": "<none>",
  },
  {
    "imageName": "<none>",
    "tag": "<none>",
    "imageID": "b49299db62e3",
    "size": "5.09MB",
    "digest": "<none>",
  },
  {
    "imageName": "<none>",
    "tag": "<none>",
    "imageID": "b6baf13fa6c4",
    "size": "5.09MB",
    "digest": "<none>",
  },
  {
    "imageName": "<none>",
    "tag": "<none>",
    "imageID": "cd6d6778f592",
    "size": "5.09MB",
    "digest": "<none>",
  },
  {
    "imageName": "<none>",
    "tag": "<none>",
    "imageID": "f0a28c245ba6",
    "size": "5.09MB",
    "digest": "<none>",
  },
  {
    "imageName": "<none>",
    "tag": "<none>",
    "imageID": "f1483c1388d0",
    "size": "5.11MB",
    "digest": "<none>",
  },
  {
    "imageName": "anchore/docker-desktop-extension",
    "tag": "0.5.1",
    "imageID": "535f4e97696b",
    "size": "916MB",
    "digest": "sha256:61a27ece803fadefbaf505b0c398fa7578e15dee8f4ad0d1d1fedd786b6e3681",
  },
  {
    "imageName": "docker/disk-usage-extension",
    "tag": "0.2.7",
    "imageID": "94a994303197",
    "size": "2.81MB",
    "digest": "sha256:12632c9298217f9972575077fb85863717bcc08565a4200288c2860fb6e3cc97",
  },
  {
    "imageName": "ghcr.io/rancher-sandbox/rancher-desktop/rdx-proxy",
    "tag": "latest",
    "imageID": "49b3c909fbd5",
    "size": "5.09MB",
    "digest": "<none>",
  },
  {
    "imageName": "ignatandrei/blockly-automation",
    "tag": "0.0.7",
    "imageID": "81ca014c5abb",
    "size": "7.52MB",
    "digest": "sha256:2eeba7d946e8f52747baecd2117fa068f45af107f93c616d66ee6313b5b4024d",
  },
  {
    "imageName": "rancher/klipper-helm",
    "tag": "v0.8.2-build20230815",
    "imageID": "5f89cb8137cc",
    "size": "256MB",
    "digest": "<none>",
  },
  {
    "imageName": "rancher/klipper-lb",
    "tag": "v0.4.4",
    "imageID": "af74bd845c4a",
    "size": "12MB",
    "digest": "<none>",
  },
  {
    "imageName": "rancher/local-path-provisioner",
    "tag": "v0.0.24",
    "imageID": "b29384aeb4b1",
    "size": "40.1MB",
    "digest": "<none>",
  },
  {
    "imageName": "rancher/mirrored-coredns-coredns",
    "tag": "1.10.1",
    "imageID": "ead0a4a53df8",
    "size": "53.6MB",
    "digest": "<none>",
  },
  {
    "imageName": "rancher/mirrored-library-busybox",
    "tag": "1.34.1",
    "imageID": "827365c7baf1",
    "size": "4.86MB",
    "digest": "<none>",
  },
  {
    "imageName": "rancher/mirrored-library-traefik",
    "tag": "2.9.10",
    "imageID": "d1e26b5f8193",
    "size": "138MB",
    "digest": "<none>",
  },
  {
    "imageName": "rancher/mirrored-metrics-server",
    "tag": "v0.6.3",
    "imageID": "817bbe3f2e51",
    "size": "68.9MB",
    "digest": "<none>",
  },
  {
    "imageName": "rancher/mirrored-pause",
    "tag": "3.6",
    "imageID": "6270bb605e12",
    "size": "683kB",
    "digest": "<none>",
  },
];

type TableColumns = {
  [key: string]: {
    header: string,
    enableSorting?: boolean,
    sortingFn?: SortingFn<RowData> | keyof SortingFns | keyof BuiltInSortingFn
  }
}

const UNITS = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
const FRACTIONAL = ['', 'm', 'u', 'n', 'p', 'f', 'a', 'z', 'y']; // milli micro nano pico femto

function parseSi(inValue: any, opt?: any) {
  opt = opt || {};
  let increment = opt.increment;
  const allowFractional = opt.allowFractional !== false;

  if (!inValue || typeof inValue !== 'string' || !inValue.length) {
    return NaN;
  }

  inValue = inValue.replace(/,/g, '');

  let [, valStr, unit, incStr] = inValue.match(/^([0-9.-]+)\s*([^0-9.-]?)([^0-9.-]?)/);
  const val = parseFloat(valStr);

  if (!unit) {
    return val;
  }

  // micro "mu" symbol -> u
  if (unit.charCodeAt(0) === 181) {
    unit = 'u';
  }

  const divide = FRACTIONAL.includes(unit);
  const multiply = UNITS.includes(unit.toUpperCase());

  if (!increment) {
    // Automatically handle 1 KB = 1000B, 1 KiB = 1024B if no increment set
    if ((multiply || divide) && incStr === 'i') {
      increment = 1024;
    } else {
      increment = 1000;
    }
  }

  if (divide && allowFractional) {
    const exp = FRACTIONAL.indexOf(unit);

    return val / (increment ** exp);
  }

  if (multiply) {
    const exp = UNITS.indexOf(unit.toUpperCase());

    return val * (increment ** exp);
  }

  // Unrecognized unit character
  return val;
}

const tableColumns: TableColumns = {
  imageName: {
    header: 'Image',
    enableSorting: true,
  },
  tag: {
    header: 'Tag',
    enableSorting: true,
  },
  imageID: {
    header: 'Image ID',
    enableSorting: true,
  },
  size: {
    header: 'Size',
    enableSorting: true,
    sortingFn: (rowA: any, rowB: any, columnId) => {
      const numA = parseSi(rowA.getValue(columnId));
      const numB = parseSi(rowB.getValue(columnId));

      return numA < numB ? 1 : numA > numB ? -1 : 0;
    },
  },
};
</script>

<template>
  <rc-table
    :table-data="images"
    :table-columns="tableColumns"
    :has-row-selection="true"
    :has-row-action="true"
  />
</template>
