var imageCollection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG"),
    imageCollection2 = ee.ImageCollection("MODIS/MCD43B3"),
    geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.MultiPolygon(
        [[[[-4.081389183906898, 40.03766961886602],
           [-4.081389183906898, 40.03766961886602],
           [-4.004484887031898, 40.03766961886602],
           [-4.004484887031898, 40.03766961886602]]],
         [[[-4.312102074531898, 40.9607804066717],
           [-4.312102074531898, 39.86501857987579],
           [-2.8069751214068983, 39.86501857987579],
           [-2.8069751214068983, 40.9607804066717]]]], null, false),
    countries = ee.FeatureCollection("FAO/GAUL/2015/level0");
var imageCollection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG"),
    imageCollection2 = ee.ImageCollection("MODIS/MCD43B3"),
    geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.MultiPolygon(
        [
         [[[-4.312102074531898, 40.9607804066717],
           [-4.312102074531898, 39.86501857987579],
           [-2.8069751214068983, 39.86501857987579],
           [-2.8069751214068983, 40.9607804066717]]]], null, false);

//alert('This app is a working testing example, not a finished product.For more advanced versions, please contact the authors. Please, remember to cite the paper in case of use of screenshoots of the app. WARNING:Measurements inside cities will not be reliable. This work only concerns diffuse light outside cities.');
// Alerta para avisar que es version beta

function createTimeBand(img) {
  var year = ee.Date(img.get('system:time_start')).get('year').subtract(2012);
  return ee.Image(year).byte().addBands(img);
}

var imageCollection3=ee.ImageCollection("NOAA/VIIRS/001/VNP09GA");
var albedo01=imageCollection3.filterDate('2012-08-01', '2012-11-30').map(createTimeBand);
var albedo02=albedo01.reduce(ee.Reducer.percentile([30]));

var albedo11=imageCollection3.filterDate('2013-08-01', '2013-11-30').map(createTimeBand);
var albedo12=albedo11.reduce(ee.Reducer.percentile([30]));

var albedo21=imageCollection3.filterDate('2014-08-01', '2014-11-30').map(createTimeBand);
var albedo22=albedo21.reduce(ee.Reducer.percentile([30]));  

var albedo31=imageCollection3.filterDate('2015-08-01', '2015-11-30').map(createTimeBand);
var albedo32=albedo31.reduce(ee.Reducer.percentile([30]));  

var albedo41=imageCollection3.filterDate('2016-08-01', '2016-11-30').map(createTimeBand);
var albedo42=albedo41.reduce(ee.Reducer.percentile([30]));    

var albedo51=imageCollection3.filterDate('2017-08-01', '2017-11-30').map(createTimeBand);
var albedo52=albedo51.reduce(ee.Reducer.percentile([30]));     

var albedo61=imageCollection3.filterDate('2018-08-01', '2018-11-30').map(createTimeBand);
var albedo62=albedo61.reduce(ee.Reducer.percentile([30])); 

var albedo71=imageCollection3.filterDate('2019-08-01', '2019-11-30').map(createTimeBand);
var albedo72=albedo71.reduce(ee.Reducer.percentile([30]));  

var albedo81=imageCollection3.filterDate('2020-08-01', '2020-11-30').map(createTimeBand);
var albedo82=albedo81.reduce(ee.Reducer.percentile([30]));   

var albedo91=imageCollection3.filterDate('2021-08-01', '2021-11-30').map(createTimeBand);
var albedo92=albedo91.reduce(ee.Reducer.percentile([30]));   

var albedo101=imageCollection3.filterDate('2022-08-01', '2022-11-30').map(createTimeBand);
var albedo102=albedo101.reduce(ee.Reducer.percentile([30]));   

var albedoS = ee.ImageCollection([albedo02,albedo12,albedo22,albedo32,albedo42,albedo52,albedo62,albedo72,albedo82,albedo92,albedo102]).median();
print(albedoS);
var albedo03=albedoS.select("I1_p30").add(albedoS.select("I2_p30"));
albedo03.select("I1_p30").add(albedoS.select("I3_p30"));
albedo03.select("I1_p30").add(albedoS.select("I4_p30"));
var albedo=albedo03.select(["I1_p30"]);
var albedo=albedo.select("I1_p30").unmask(504);
var albedoB = albedo.addBands(ee.Image(1));
var albedoRAW=albedoB
 //var albedo = albedo.expression('IMA/1370.5*0.14+0.0778+0.03',{'IMA':albedo.select("Albedo_BSA_Band1_median")});
 var albedoB = albedoB.expression('IMA*pen+ord',{'IMA':albedoB.select("I1_p30"),'pen':6.51973060199193E-06
,'ord':0.005457731456686476+0.037369735174887814});//+0.037369735174887814/+0.0979860271892004

 var albedoB=albedoB.select("I1_p30").unmask(0.008699625705382078);//+0.037369735174887814  

var collection01 =ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2012-08-01', '2012-11-30').map(createTimeBand);
var maxval=0;
var collection02 = collection01.reduce(ee.Reducer.median());
collection02 = collection02.multiply(collection02.gte(maxval));
var collection02 = collection02.set('system:time_start','2012-10-01');



//var collection02 = collection02.set('system:time_start','2012-08-01');
var collection021=collection02.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).add(0.013).log10();
var collection021 = collection021.expression(
  '20-1.9*VIIRS', {
      'VIIRS': collection021
});

var collection021 = collection021.set('system:time_start','2012-10-01'); 
var collection021 = collection021.addBands(collection02.select("constant_median"))
var collection021=collection021.rename( 'avg_rad_median','constant_median')

print(collection021)
//var collection1 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG').filterDate('2013-08-01', '2013-11-30').select('avg_rad').reduce(ee.Reducer.median());


  
var collection11 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2013-08-01', '2013-11-30').map(createTimeBand);
  
var collection12 = collection11.reduce(ee.Reducer.median());

collection12 = collection12.multiply(collection12.gte(maxval));

var collection12 = collection12.set('system:time_start','2013-10-01');
var collection121=collection12.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).add(0.05).log10();
var collection121 = collection121.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection121
});

var collection121 = collection121.set('system:time_start','2013-10-01');
var collection121 = collection121.addBands(collection12.select("constant_median"))
var collection121=collection121.rename( 'avg_rad_median','constant_median')


var collection2 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2014-08-01', '2014-11-30').select('avg_rad').reduce(ee.Reducer.median());
  
var collection21 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2014-08-01', '2014-11-30').map(createTimeBand);
  
var collection22 = collection21.reduce(ee.Reducer.median());

collection22 = collection22.multiply(collection22.gte(maxval));

var collection22 = collection22.set('system:time_start','2014-10-01'); 
var collection221=collection22.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).add(0.085).log10();
var collection221 = collection221.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection221
});

var collection221 = collection221.set('system:time_start','2014-10-01');
var collection221 = collection221.addBands(collection22.select("constant_median"))
var collection221=collection221.rename( 'avg_rad_median','constant_median')


 
var collection3 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2015-08-01', '2015-11-30').select('avg_rad').reduce(ee.Reducer.median());
  
var collection31 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2015-08-01', '2015-11-30').map(createTimeBand);
  
var collection32 = collection31.reduce(ee.Reducer.median());;

collection32 = collection32.multiply(collection32.gte(maxval));
var collection32 = collection32.set('system:time_start','2015-10-01'); 
var collection321=collection32.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).subtract(-0.129).log10();
var collection321 = collection321.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection321
});

var collection321 = collection321.set('system:time_start','2015-10-01');
var collection321 = collection321.addBands(collection32.select("constant_median"))
var collection321=collection321.rename( 'avg_rad_median','constant_median')


 
var collection4 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2016-08-01', '2016-11-30').reduce(ee.Reducer.median());
  
var collection41 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2016-08-01', '2016-11-30').map(createTimeBand);
  
var collection42 = collection41.reduce(ee.Reducer.median());

collection42 = collection42.multiply(collection42.gte(maxval));

var collection421=collection42.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).add(0.085).log10();
var collection421 = collection421.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection421
});
var collection42 = collection42.set('system:time_start','2016-10-01'); 
var collection421 = collection421.set('system:time_start','2016-10-01');
var collection421 = collection421.addBands(collection42.select("constant_median"))
var collection421=collection421.rename( 'avg_rad_median','constant_median')



var collection5 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2017-08-01', '2017-11-30').reduce(ee.Reducer.median());
  
var collection51 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2017-08-01', '2017-11-30').map(createTimeBand);
  
var collection52 = collection51.reduce(ee.Reducer.median());

collection52 = collection52.multiply(collection52.gte(maxval));
var collection521=collection52.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).subtract(0.073).log10();
var collection521 = collection521.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection521
});
var collection52 = collection52.set('system:time_start','2017-10-01'); 
var collection521 = collection521.set('system:time_start','2017-10-01');
var collection521 = collection521.addBands(collection52.select("constant_median"))
var collection521=collection521.rename( 'avg_rad_median','constant_median')


  
var collection61 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2018-08-01', '2018-11-30').map(createTimeBand);
  
var collection62 = collection61.reduce(ee.Reducer.median());

collection62 = collection62.multiply(collection62.gte(maxval));
var collection62 = collection62.set('system:time_start','2018-10-01');

var collection621=collection62.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).subtract(0.045).log10();
var collection621 = collection62.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection621
});
var collection621 = collection621.set('system:time_start','2018-10-01');
var collection621 = collection621.addBands(collection12.select("constant_median"))
var collection621=collection621.rename( 'avg_rad_median','constant_median')

/////


 
var collection71 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2019-08-01', '2019-11-30').map(createTimeBand);
  
var collection72 = collection71.reduce(ee.Reducer.median());

collection72 = collection72.multiply(collection72.gte(maxval));
var collection72 = collection72.set('system:time_start','2019-10-01'); 
var collection721=collection72.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).subtract(0.02).log10();
var collection721 = collection72.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection721
});
var collection721 = collection721.set('system:time_start','2019-10-01');
var collection721 = collection721.addBands(collection72.select("constant_median"))
var collection721=collection721.rename( 'avg_rad_median','constant_median')


var collection81 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2020-08-01', '2020-11-30').map(createTimeBand);
  
var collection82 = collection81.reduce(ee.Reducer.median());

collection82 = collection82.multiply(collection82.gte(maxval));
var collection82 = collection82.set('system:time_start','2020-10-01'); 
var collection821=collection82.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).subtract(0.14).log10();
var collection821 = collection82.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection821
});
var collection821 = collection821.set('system:time_start','2020-10-01');
var collection821 = collection821.addBands(collection82.select("constant_median"))
var collection821=collection821.rename( 'avg_rad_median','constant_median')
print(collection821)

var collection91 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2021-08-01', '2021-11-30').map(createTimeBand);
  
var collection92 = collection91.reduce(ee.Reducer.median());

collection92 = collection92.multiply(collection92.gte(maxval));
var collection92 = collection92.set('system:time_start','2021-10-01'); 
var collection921=collection92.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).subtract(0.15).log10();

var collection921 = collection92.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection921
});
var collection921 = collection921.set('system:time_start','2021-10-01');

var collection921 = collection921.addBands(collection92.select("constant_median"))
var collection921=collection921.rename( 'avg_rad_median','constant_median')
print(collection921)

/////////////////////////////
var collection101 = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
  .filterDate('2022-08-01', '2022-11-30').map(createTimeBand);
  
var collection102 = collection101.reduce(ee.Reducer.median());

collection102 = collection102.multiply(collection102.gte(maxval));
var collection102 = collection102.set('system:time_start','2021-10-01'); 
var collection1021=collection102.select(['avg_rad_median']).subtract(albedoB.select("I1_p30")).subtract(0.15).log10();

var collection1021 = collection102.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': collection1021
});
var collection1021 = collection1021.set('system:time_start','2022-10-01');

var collection1021 = collection1021.addBands(collection102.select("constant_median"))
var collection1021=collection1021.rename( 'avg_rad_median','constant_median')
print(collection1021)


var VIIRS201209 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20120901");
var VIIRS201609 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20160901");
var VIIRS201210 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20121001");
var VIIRS201610 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20161001");

var F162010_c1a = ee.Image("NOAA/DMSP-OLS/CALIBRATED_LIGHTS_V4/F16_20100111-20101209_V4");



  
var collectionS = ee.ImageCollection([collection02,collection12,collection22,collection32,collection42,collection52,collection62,collection72,collection82,collection92,collection102]);
var collectionSX = ee.ImageCollection([collection021,collection121,collection221,collection321,collection421,collection521,collection621,collection721,collection821,collection921,collection1021]);
//var collectionS = ee.ImageCollection([collection02,collection42]);

  
//var collection = collection1.subtract(collection2);

//print(collection42)

//var collectionS2=collectionS.select(['constant_median', 'avg_rad_median']).reduce(ee.Reducer.linearFit())

var collectionS3=collectionSX.select(['constant_median', 'avg_rad_median']).reduce(ee.Reducer.mean());
Map.addLayer(collectionS3,{},'2012-2021')
// Visualize brightness in green and a linear fit trend line in red/blue.

//var linearFit = collectionS.select(['constant_median', 'avg_rad_median']).reduce(ee.Reducer.linearFit());

//var scalerel=linearFit.select(['scale']).divide(linearFit.select(['offset']));
//var linearFit2=linearFit.addBands(scalerel);
//var linearFit3=linearFit2.filter(ee.Filter.lq(linearFit.select(['offset'], 1));
//print(collection52)
//var canny = collection02.select(['avg_rad_median']).gte(0.27);
//print(canny)
//var linearFit3=linearFit2.multiply(canny.select(['avg_rad_median']));



var vizParams = {
  bands: ['avg_rad_median'],
  min: 0.4,
  max: 100,
  gamma: 2.0,
};

var vizParams3 = {
  bands: ['avg_rad_median_mean'],
  min: 0,
  max: 1,
  gamma: 9.0,
};


print(albedo);

// Define an arbitrary region of interest.


var world2 = ee.Geometry.Polygon([-140, 60, 0, 60, 155, 60, 155, -50, 10, -50, -140, -50], null, false)
var boxcar = ee.Kernel.square({
  radius: 10, units: 'pixels', normalize: true
});
var createConstantBand = function(image) {
  return ee.Image(1).addBands(image);
};
// Smooth the image by convolving with the boxcar kernel.
var collectionS3B = collectionS3.convolve(boxcar);

 
var collectionS3B = collectionS3B.addBands(ee.Image(1));
 
var collectionS4=collectionS3.select('avg_rad_median_mean')
//var max1=albedo.reduce(ee.Reducer.max());
//var min1=albedo.reduce(ee.Reducer.percentile([30]));
var vizParams2 = {
  bands: [],
  min: 0,
  max: 300,
  gamma: 3.0,
};
var VIIRS=collectionS4.select(['avg_rad_median_mean']).log10();
// Compute the EVI using an expression.
var evi = VIIRS.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': VIIRS
});
var vizParams2 = {
  bands: ["avg_rad_median"],
  min: 22,
  max: 17,
  gamma: 3.0,
};

var vis = {bands: ['avg_rad_median_mean'],min: 17, max: 22, palette: ['#FFFFFF',
 '#FFFDFF',
 '#FFF9FF',
 '#FFF9FF',
 '#FFF7FF',
 '#FFF5FF',
 '#FFF3FF',
 '#FFF1FF',
 '#FFEFFF',
 '#FFECFF',
 '#FFE9FF',
 '#FFE6FF',
 '#FFE3FF',
 '#FFE1FC',
 '#FFDFFA',
 '#FFDDF8',
 '#FFDBF6',
 '#FFD9F4',
 '#FFD7F2',
 '#FFD5F0',
 '#FFD3EE',
 '#FFD1EC',
 '#FFCFEA',
 '#FFD1E8',
 '#FFD3E6',
 '#FFD5E4',
 '#FFD7E2',
 '#FFD9E0',
 '#FFDBDE',
 '#FFDDDC',
 '#FFDFDA',
 '#FFE1D8',
 '#FFE3D6',
 '#FFE5D4',
 '#FFE7D2',
 '#FFE9D0',
 '#FFE9D0',
 '#FFEDCC',
 '#FFEFCA',
 '#FFF1C8',
 '#FFF2C6',
 '#FFF3C4',
 '#FFF4C2',
 '#FCF5C1',
 '#F8F6C0',
 '#F4F7BF',
 '#F1F8BD',
 '#EDF9BC',
 '#EBFABE',
 '#E9FBC0',
 '#E7FCC2',
 '#E5FDC4',
 '#E3FEC6',
 '#E1FECA',
 '#DFFFCE',
 '#DDFED2',
 '#DBFED6',
 '#D9FEDA',
 '#D7FEDE',
 '#D5FEE2',
 '#CCE0FE',
 '#CEDCFE',
 '#D1D8FE',
 '#D2D2FC',
 '#D3CCFA',
 '#C2F4FF',
 '#C4F0FE',
 '#C6ECF5',
 '#C8E8FE',
 '#CAE4FE',
 '#CCFEF8',
 '#C9FEFB',
 '#C6FCFC',
 '#C3FAFD',
 '#C0F8FF',
 '#D3FEE6',
 '#D2FEEA',
 '#D0FEED',
 '#CEFEF0',
 '#CDFEF4',
 '#D3C4F8',
 '#D3BCF6',
 '#D3B4F4',
 '#D3ACF2',
 '#D4A2EE',
 '#D498E8',
 '#D48EE0',
 '#D484D6',
 '#D57ACA',
 '#D670BA',
 '#D866AA',
 '#DA5C9A',
 '#DC528A',
 '#DF487A',
 '#E23E6A',
 '#DF345A',
 '#DC2A4A',
 '#D9203C',
 '#D61636',
 '#D3122F',
 '#D0192B',
 '#CE192B',
 '#CC3029',
 '#CA3C28',
 '#C84827',
 '#CD5826',
 '#D26625',
 '#D87424',
 '#DE8223',
 '#E49122',
 '#E9A021',
 '#EEAD20',
 '#F3BA1F',
 '#F8C81E',
 '#F7D21E',
 '#F3D01E',
 '#EFC81E',
 '#E4C21E',
 '#D0C01F',
 '#BCBE20',
 '#A8BD22',
 '#94BB24',
 '#80B927',
 '#6CB92A',
 '#58BA2D',
 '#4CBC36',
 '#42BE40',
 '#3AC04C',
 '#34C25A',
 '#30C46A',
 '#2DC678',
 '#2AC786',
 '#27C894',
 '#24C7A2',
 '#21C5B0',
 '#1EC1BC',
 '#1BBCC8',
 '#18B2D1',
 '#15A6D6',
 '#129ADA',
 '#118EDC',
 '#1382DC',
 '#1576DC',
 '#176ADC',
 '#195EDC',
 '#1B52DA',
 '#1D46D8',
 '#1F3AD6',
 '#212ED4',
 '#2324D2',
 '#251CCF',
 '#2A18CB',
 '#3116C7',
 '#3818C4',
 '#401AC2',
 '#481CBE',
 '#4F1EB9',
 '#5620B4',
 '#5D22AE',
 '#6324A7',
 '#65269C',
 '#632894',
 '#636a7a',
 '#808080',
 '#7e7e7e',
 '#717171',
 '#49494a',
 '#49494a',
 '#393939',
 '#262626',
 '#191919',
 '#161616',
 '#111210',
 '#0d0d0b',
 '#000000']
};

if (1){    
//Map.setCenter(-3.7353515625,40.463666324587685, 7);
Map.addLayer(albedoB,{min: 0, max:1,  gamma: 9.0,},'albedoB');
Map.addLayer(albedoRAW,{min: 0, max:14000,  gamma: 9.0,},'albedoRAW');
//Map.addLayer(collection02,vis,'2012');
//Map.addLayer(collection12,vis,'2013');
//Map.addLayer(collection22,vis,'2014');
//Map.addLayer(collection32,vis,'2015');
//Map.addLayer(collection42,vis,'2016');
//Map.addLayer(collection52,vis,'2017');
//Map.addLayer(collection62,vis,'2018');
//Map.addLayer(collectionS3,vis,'2012-2018');
Map.addLayer(collectionS4,vis,'2012-2018_albedo');

//Map.addLayer(F162010_c1a,vizParams2,'2011');
}

var vizParams2 = {
  bands: ["avg_rad_median"],
  min: 22,
  max: 17,
  gamma: 3.0,
};

// A simple tool for charting MODIS ocean surface temperature.


/*
 * Map layer configuration
 */

// Compute the mean sea surface temperature (SST) value for each pixel by
// averaging MODIS Aqua data for one year.
var modisOceanColor = collectionSX
print(collectionSX)
var sst =
    modisOceanColor.select(["avg_rad_median"]).filterDate('2012-01-01', '2022-01-01');
    




var series = sst.filterDate('2011-01-01', '2021-12-31').map(function(image) {
    return image.select(['avg_rad_median']).set('system:time_start', image.get('system:time_start'));
});


var composite1 = collectionS4//.log10()
var composite2 = sst.mean().log10()
print(collectionS4)
var collectionS4=collectionS4.unmask(0)
var VIIRS=composite1.select(['avg_rad_median_mean']);
var VIIRS2=composite1.select(['constant']);
// Compute the EVI using an expression.
print(VIIRS)
var evi = VIIRS.expression(
  '20.0-1.9*VIIRS', {
      'VIIRS': VIIRS
});
var evi2 = VIIRS2.expression(
  '20.0-1.9*VIIRS2', {
      'VIIRS2': VIIRS2
});

composite1=collectionS4.unmask(22)
composite2=collectionS4.unmask(22)

var composite=composite1.visualize(vis);
var composite2=composite2.visualize(vis);
var compositeLayer = ui.Map.Layer(composite).setName('SkyBrightness VIIRS Median');
var compositeLayer2 = ui.Map.Layer(composite2).setName('SkyBrightness VIIRS Mean');

// Create the main map and set the SST layer.
var mapPanel = ui.Map();
var layers = mapPanel.layers();
layers.add(compositeLayer, '2012-2021 composite median');
layers.add(compositeLayer2, '2012-2021 composite mean');


/*
 * Panel setup
 */

// Create a panel to hold title, intro text, chart and legend components.
var inspectorPanel = ui.Panel({style: {width: '30%'}});

// Create an intro panel with labels.
var intro = ui.Panel([
  ui.Label({
    value: 'Sky Brightness VIIRS - Time Series Inspector',
    style: {fontSize: '20px', fontWeight: 'bold'}
  }),
  ui.Label('Click a location to see its time series of Sky Brightness')
]);
inspectorPanel.add(intro);

// Create panels to hold lon/lat values.
var lon = ui.Label();
var lat = ui.Label();
inspectorPanel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));

// Add placeholders for the chart and legend.
inspectorPanel.add(ui.Label('[Chart]'));
inspectorPanel.add(ui.Label('[Legend]'));


/*
 * Chart setup
 */

// Generates a new time series chart of SST for the given coordinates.
var generateChart = function (coords) {
  // Update the lon/lat panel with values from the click event.
  lon.setValue('lon: ' + coords.lon.toFixed(2));
  lat.setValue('lat: ' + coords.lat.toFixed(2));

  // Add a dot for the point clicked on.
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var dot = ui.Map.Layer(point, {color: '000000'}, 'clicked location');
  // Add the dot as the second layer, so it shows up on top of the composite.
  mapPanel.layers().set(1, dot);

  // Make a chart from the time series.
  var sstChart = ui.Chart.image.series(sst, point, ee.Reducer.median(), 500);
  // Customize the chart.
  sstChart.setOptions({
    title: 'Radiance of VIIRS',
    vAxis: {title: 'mpsas'},
    hAxis: {title: 'Date', format: 'MM-yy', gridlines: {count: 7}},
    series: {
      0: {
        color: 'blue',
        lineWidth: 0,
        pointsVisible: true,
        pointSize: 2,
      },
    },
    legend: {position: 'right'},
  });
  // Add the chart at a fixed position, so that new charts overwrite older ones.
  inspectorPanel.widgets().set(2, sstChart);
};


/*
 * Legend setup
 */

// Creates a color bar thumbnail image for use in legend from the given color
// palette.
function makeColorBarParams(palette) {
  return {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  };
}



// Create the color bar for the legend.
var colorBar = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: makeColorBarParams(vis.palette),
  style: {stretch: 'horizontal', margin: '0px 8px', maxHeight: '24px'},
});

// Create a panel with three numbers for the legend.
var legendLabels = ui.Panel({
  widgets: [
    ui.Label(vis.min, {margin: '4px 8px'}),
    ui.Label(
        (vis.max / 2),
        {margin: '4px 8px', textAlign: 'center', stretch: 'horizontal'}),
    ui.Label(vis.max, {margin: '4px 8px'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});

var legendTitle = ui.Label({
  value: 'Map Legend: Sky Brightness (mpsas)',
  style: {fontWeight: 'bold'}
});

var legendPanel = ui.Panel([legendTitle, colorBar, legendLabels]);
inspectorPanel.widgets().set(3, legendPanel);


var inspector1 = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical')

});

  inspector1.style().set({
  width: '200px',
  position: 'bottom-right'});
  
// Add a label to the panel.
inspectorPanel.add(ui.Label('Tool provided by the EMISSI@n project'));
inspectorPanel.add(ui.Label('Grants: NERC grant NE/P01156X/1; H2020-INFRASUPP-2015-2;GEOEssential 689443;MINECO AYA2011-15808-E;H2020-ICT-2015-688135;AYA2016–75808–R;P2018/NMT-4291;ERC-RA-0031;Cities at Night project;F.Sánchez de Miguel'));
inspectorPanel.add(ui.Label('Institutions:'));
inspectorPanel.add(ui.Label('University of Exeter/U. Complutense de Madrid/IAA-CSIC/GFZ/IGB'));
inspectorPanel.add(ui.Label('Source images from Earth Observation Group (EOG) Colorado School of Mines and SNPP/VIIRS-DNB'));
inspectorPanel.add(ui.Label('Cite and credit of current version: Sanchez de Miguel, A., Kyba, C.C.M., Zamorano, J. et al. The nature of the diffuse light near cities detected in nighttime satellite imagery. Sci Rep 10, 7829 (2020). https://doi.org/10.1038/s41598-020-64673-2'));
//Map.add(inspector1);


/*
 * Map setup
 */

// Register a callback on the default map to be invoked when the map is clicked.
mapPanel.onClick(generateChart);

// Configure the map.
mapPanel.style().set('cursor', 'crosshair');


// Initialize with a test point.
var initialPoint = ee.Geometry.Point(-19.155, 22.313);
mapPanel.centerObject(initialPoint, 4);


/*
 * Initialize the app
 */

// Replace the root with a SplitPanel that contains the inspector and map.
ui.root.clear();
ui.root.add(ui.SplitPanel(inspectorPanel, mapPanel));

generateChart({
  lon: initialPoint.coordinates().get(0).getInfo(),
  lat: initialPoint.coordinates().get(1).getInfo()
});

var country=countries.filter(ee.Filter.eq('ADM0_CODE',			146))
//var country2=country.buffer(3000)
var scala=20000//100000
/*
var testXX=composite2.clip(country).clip(country.geometry().centroid().buffer(scala)).getThumbURL({
  min:[1, 1, 1],
  max:[255, 255, 255],
  gamma: [1, 1, 1],
  'dimensions': 1000,
  geometry:country.geometry().centroid().buffer(scala),
  'crs': 'EPSG:4326'
});
*/
//Map.addLayer(table2,false)
//Map.addLayer(GR,{},'GR',false)
//Map.addLayer(BG,{},'BG',false)

//print(testXX)
print(collectionS3)

var testXX2=collectionS3.select('avg_rad_median_mean').clip(country).clip(country.geometry().centroid().buffer(scala)).getThumbURL({
  min:[22],
  max:[18],
  gamma: [1],
  'dimensions': 1000,
  geometry:country.geometry().centroid().buffer(scala),
  'crs': 'EPSG:4326'
});
print(testXX2)


