import prettyBytes from 'pretty-bytes';
import { formatToDateTime } from 'renderer/utils/dateUtils';
import OpenMapByLocation from './OpenMapByLocation';

const metaDataMap: {
  key: string;
  label: string;
  render?: (val: any, data: Recordable) => React.ReactNode;
}[] = [
  /**
   * ===============基本信息===============
   */
  {
    key: 'divider',
    label: '基本信息',
  },
  {
    key: 'format',
    label: '格式',
  },
  {
    key: 'width',
    label: '尺寸',
    render(_: number, data: Recordable) {
      return `${data.width} × ${data.height}`;
    },
  },
  {
    key: 'size',
    label: '文件大小',
    render(val: number) {
      return prettyBytes(val);
    },
  },
  {
    key: 'path',
    label: '文件路径',
  },
  {
    key: 'density',
    label: 'DPI',
  },
  {
    key: 'hasAlpha',
    label: 'Alpha通道',
    render(val: boolean) {
      return val ? '是' : '否';
    },
  },
  /**
   * ===============时间信息===============
   */
  {
    key: 'divider',
    label: '时间信息',
  },
  {
    key: 'birthtime',
    label: '创建时间',
    render(val: Date) {
      return formatToDateTime(val);
    },
  },
  {
    key: 'mtime',
    label: '上次修改时间',
    render(val: Date) {
      return formatToDateTime(val);
    },
  },
  {
    key: 'atime',
    label: '上次访问时间',
    render(val: Date) {
      return formatToDateTime(val);
    },
  },
  {
    key: 'ctime',
    label: '文件状态修改时间',
    render(val: Date) {
      return formatToDateTime(val);
    },
  },

  /**
   * ===============设备信息===============
   */
  {
    key: 'divider',
    label: '设备信息',
  },
  {
    key: 'Device Manufacturer',
    label: '设备制造商',
    render(val, data) {
      return (data.Make || data['Device Manufacturer'])?.description;
    },
  },
  {
    key: 'Device Model Number',
    label: '设备型号',
    render(val, data) {
      return (data.Model || data['Device Model Number'])?.description;
    },
  },
  { key: 'Software', label: '软件/系统版本' },
  { key: 'LensMake', label: '镜头制造商' },
  { key: 'LensModel', label: '镜头模式' },
  { key: 'LensSpecification', label: '镜头规格' },

  /**
   * ===============拍摄参数===============
   */
  {
    key: 'divider',
    label: '拍摄参数',
  },
  { key: 'ExposureTime', label: '曝光时间' },
  { key: 'FNumber', label: '光圈值' },
  { key: 'ExposureProgram', label: '曝光程序' },
  { key: 'SpectralSensitivity', label: '光谱灵敏度' },
  { key: 'ISOSpeedRatings', label: '感光度' },
  { key: 'OECF', label: '光电转换功能' },
  { key: 'ShutterSpeedValue', label: '快门速度' },
  { key: 'ApertureValue', label: '镜头光圈' },
  { key: 'BrightnessValue', label: '亮度' },
  { key: 'ExposureBiasValue', label: '曝光补偿' },
  { key: 'MaxApertureValue', label: '最大光圈' },
  { key: 'SubjectDistance', label: '物距' },
  { key: 'MeteringMode', label: '测光方式' },
  { key: 'Lightsource', label: '光源' },
  { key: 'Flash', label: '闪光灯' },
  { key: 'SubjectArea', label: '主体区域' },
  { key: 'FocalLength', label: '焦距' },
  { key: 'FlashEnergy', label: '闪光灯强度' },
  { key: 'SpatialFrequencyResponse', label: '空间频率反应' },
  { key: 'FocalPlaneXResolution', label: '焦距平面X轴解析度' },
  { key: 'FocalPlaneYResolution', label: '焦距平面Y轴解析度' },
  { key: 'FocalPlaneResolutionUnit', label: '焦距平面解析度单位' },
  { key: 'SubjectLocation', label: '主体位置' },
  { key: 'ExposureIndex', label: '曝光指数' },
  { key: 'SensingMethod', label: '图像传感器类型' },
  { key: 'FileSource', label: '源文件' },
  { key: 'SceneType', label: '场景类型' },
  { key: 'CFAPattern', label: 'CFA 模式' },
  { key: 'CustomRendered', label: '自定义图像处理' },
  { key: 'ExposureMode', label: '曝光模式' },
  { key: 'WhiteBalance', label: '白平衡' },
  { key: 'DigitalZoomRation', label: '数字变焦' },
  { key: 'FocalLengthIn35mmFilm', label: '35毫米胶片焦距' },
  { key: 'SceneCaptureType', label: '场景拍摄类型' },
  { key: 'GainControl', label: '场景控制' },
  { key: 'Contrast', label: '对比度' },
  { key: 'Saturation', label: '饱和度' },
  { key: 'Sharpness', label: '锐度' },
  { key: 'DeviceSettingDescription', label: '设备设定描述' },
  { key: 'SubjectDistanceRange', label: '主体距离范围' },

  /**
   * ==============GPS================
   */
  {
    key: 'divider',
    label: 'GPS 相关',
  },
  {
    key: 'location',
    label: '位置',
    render(val, data) {
      return (
        <OpenMapByLocation
          longitude={data.GPSLongitude?.description}
          latitude={data.GPSLatitude?.description}
        />
      );
    },
  },
  { key: 'GPSLatitude', label: '纬度' },
  { key: 'GPSLongitude', label: '经度' },
  { key: 'GPSLatitudeRef', label: '南北纬' },
  { key: 'GPSLongitudeRef', label: '东西经' },
  { key: 'GPSVersionID', label: 'GPS 版本' },
  { key: 'GPSAltitudeRef', label: '海拔参照值' },
  { key: 'GPSAltitude', label: '海拔' },
  { key: 'GPSTimeStamp', label: 'GPS 时间戳' },
  { key: 'GPSSatellites', label: '测量的卫星' },
  { key: 'GPSStatus', label: '接收器状态' },
  { key: 'GPSMeasureMode', label: '测量模式' },
  { key: 'GPSDOP', label: '测量精度' },
  { key: 'GPSSpeedRef', label: '速度单位' },
  { key: 'GPSSpeed', label: 'GPS 接收器速度' },
  { key: 'GPSTrackRef', label: '移动方位参照' },
  { key: 'GPSTrack', label: '移动方位' },
  { key: 'GPSImgDirectionRef', label: '图像方位参照' },
  { key: 'GPSImgDirection', label: '图像方位' },
  { key: 'GPSMapDatum', label: '地理测量资料' },
  { key: 'GPSDestLatitudeRef', label: '目标纬度参照' },
  { key: 'GPSDestLatitude', label: '目标纬度' },
  { key: 'GPSDestLongitudeRef', label: '目标经度参照' },
  { key: 'GPSDestLongitude', label: '目标经度' },
  { key: 'GPSDestBearingRef', label: '目标方位参照' },
  { key: 'GPSDestBearing', label: '目标方位' },
  { key: 'GPSDestDistanceRef', label: '目标距离参照' },
  { key: 'GPSDestDistance', label: '目标距离' },
  { key: 'GPSProcessingMethod', label: 'GPS 处理方法名' },
  { key: 'GPSAreaInformation', label: 'GPS 区功能变数名' },
  { key: 'GPSDateStamp', label: 'GPS 日期' },
  { key: 'GPSDifferential', label: 'GPS 修正' },

  /**
   * ===============EXIF信息===============
   */
  {
    key: 'divider',
    label: 'EXIF标识',
  },

  { key: 'ExifVersion', label: 'Exif 版本' },
  { key: 'CreatorTool', label: '创建工具' },

  { key: 'DocumentID', label: '文档ID' },
  { key: 'History', label: '历史' },

  {
    key: 'Primary Platform',
    label: 'Primary Platform',
  },
  {
    key: 'Profile Creator',
    label: 'Profile Creator',
  },
  {
    key: 'Profile Version',
    label: 'Profile Version',
  },
  {
    key: 'Profile/Device class',
    label: 'Profile/Device class',
  },
  {
    key: 'Rendering Intent',
    label: 'Rendering Intent',
  },
  { key: 'Exif IFD Pointer', label: 'Exif IFD Pointer' },
  { key: 'FlashpixVersion', label: 'FlashPix 版本' },
  { key: 'ColorSpace', label: '色域、色彩空间' },
  { key: 'Image Width', label: '图像宽度' },
  { key: 'Image Height', label: '图像高度' },
  { key: 'PixelXDimension', label: '图像的有效宽度' },
  { key: 'PixelYDimension', label: '图像的有效高度' },
  { key: 'ComponentsConfiguration', label: '图像构造' },
  { key: 'Bits Per Sample', label: '比特采样率' },
  { key: 'CompressedBitsPerPixel', label: '压缩时每像素色彩位' },
  { key: 'MakerNote', label: '制造商设置的信息' },
  { key: 'UserComment', label: '用户评论' },
  { key: 'RelatedSoundFile', label: '关联的声音文件' },
  { key: 'DateTimeOriginal', label: '创建时间' },
  { key: 'DateTimeDigitized', label: '数字化创建时间' },
  { key: 'SubsecTime', label: '日期时间（秒）' },
  { key: 'SubsecTimeOriginal', label: '原始日期时间（秒）' },
  { key: 'SubsecTimeDigitized', label: '原始日期时间数字化（秒）' },

  { key: 'ImageUniqueID', label: '图像唯一ID' },

  /**
   * ===============ICC 相关===============
   */
  {
    key: 'divider',
    label: 'ICC 相关',
  },
  { key: 'ICC Copyright', label: 'ICC Copyright' },
  { key: 'ICC Description', label: 'ICC Description' },
  {
    key: 'ICC Device Manufacturer for Display',
    label: 'ICC Device Manufacturer for Display',
  },
  {
    key: 'ICC Device Model Description',
    label: 'ICC Device Model Description',
  },
  {
    key: 'ICC Profile Date',
    label: 'ICC Profile Date',
  },
  {
    key: 'ICC Signature',
    label: 'ICC Signature',
  },
  {
    key: 'ICC Viewing Conditions Description',
    label: 'ICC Viewing Conditions Description',
  },
  {
    key: 'ICCProfile',
    label: 'ICCProfile',
  },

  /**
   * ===============Tiff 相关===============
   */
  {
    key: 'divider',
    label: 'Tiff 相关',
  },

  { key: 'Compression', label: '压缩方法' },
  { key: 'PhotometricInterpretation', label: '像素合成' },
  { key: 'Orientation', label: '拍摄方向' },
  { key: 'SamplesPerPixel', label: '像素数' },
  { key: 'PlanarConfiguration', label: '数据排列' },
  { key: 'SubSampling', label: '色相抽样比率' },
  { key: 'YCbCrPositioning', label: '色相配置' },
  { key: 'XResolution', label: 'X方向分辨率' },
  { key: 'YResolution', label: 'Y方向分辨率' },
  { key: 'ResolutionUnit', label: '分辨率单位' },
  { key: 'StripOffsets', label: '图像资料位置' },
  { key: 'RowsPerStrip', label: '每带行数' },
  { key: 'StripByteCounts', label: '每压缩带比特数' },
  { key: 'JPEGInterchangeFormat', label: 'JPEG SOI 偏移量' },
  { key: 'JPEGInterchangeFormatLength', label: 'JPEG 比特数' },
  { key: 'TransferFunction', label: '转移功能' },
  { key: 'WhitePoint', label: '白点色度' },
  { key: 'PrimaryChromaticities', label: '主要色度' },
  { key: 'YCbCrCoefficients', label: '颜色空间转换矩阵系数' },
  { key: 'ReferenceBlackWhite', label: '黑白参照值' },
  { key: 'DateTime', label: '日期和时间' },
  { key: 'ImageDescription', label: '图像描述、来源' },

  { key: 'Artist', label: '作者' },
  { key: 'Copyright', label: '版权信息' },
];

export default metaDataMap;
