import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Form, FormInstance, InputNumber, Radio, Select } from 'antd';
import { ChannelsEnum, ImgConvertOutputTypeEnum } from 'main/types';
import DirSelect from 'renderer/components/DirSelect';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formatOptions = [
  {
    label: 'JPEG',
    value: 'jpeg',
  },
  {
    label: 'PNG',
    value: 'png',
  },
  {
    label: 'WebP',
    value: 'webp',
  },
  {
    label: 'GIF',
    value: 'gif',
  },
  // {
  //   label: 'JP2',
  //   value: 'jp2',
  // },
  {
    label: 'TIFF',
    value: 'tiff',
  },
  {
    label: 'AVIF',
    value: 'avif',
  },
  {
    label: 'HEIF',
    value: 'heif',
  },
  // {
  //   label: 'JPEG-XL (JXL) ',
  //   value: 'jxl',
  // },
];

const ConfigForm = ({ form }: { form: FormInstance }) => {
  const [showDirInput, setShowDirInput] = useState(false);

  const handleFormValueChange = ({
    outputType,
  }: {
    outputType: ImgConvertOutputTypeEnum;
  }): void => {
    if (outputType) {
      setShowDirInput(outputType === ImgConvertOutputTypeEnum.NEW_DIR);
    }
  };

  return (
    <Wrapper>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        initialValues={{
          quality: 80,
          outputType: ImgConvertOutputTypeEnum.SOURCE_DIR,
        }}
        onValuesChange={handleFormValueChange}
      >
        <Form.Item name="format" label="文件格式" rules={[{ required: true }]}>
          <Select placeholder="请选择" allowClear options={formatOptions} />
        </Form.Item>

        <Form.Item name="quality" label="文件质量" rules={[{ required: true }]}>
          <InputNumber placeholder="请输入1-100的数字" min={1} max={100} />
        </Form.Item>

        <Form.Item
          name="outputType"
          label="存储位置"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={ImgConvertOutputTypeEnum.SOURCE_DIR}>
              源文件所在目录
            </Radio>
            <Radio value={ImgConvertOutputTypeEnum.NEW_DIR}> 指定目录 </Radio>
          </Radio.Group>
        </Form.Item>

        {showDirInput && (
          <Form.Item
            name="outputDir"
            label="指定目录位置"
            rules={[{ required: true }]}
          >
            <DirSelect />
          </Form.Item>
        )}
      </Form>
    </Wrapper>
  );
};

export default ConfigForm;

const Wrapper = styled.div`
  width: 500px;
`;
