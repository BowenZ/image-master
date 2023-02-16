import React from 'react';
import styled from 'styled-components';
import { Button, Form, FormInstance, InputNumber, Select } from 'antd';

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
  {
    label: 'JP2',
    value: 'jp2',
  },
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
  {
    label: 'JPEG-XL (JXL) ',
    value: 'jxl',
  },
];

const ConfigForm = ({ form }: { form: FormInstance }) => {
  return (
    <Wrapper>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        initialValues={{
          quality: 80,
        }}
      >
        <Form.Item name="format" label="文件格式" rules={[{ required: true }]}>
          <Select placeholder="请选择" allowClear options={formatOptions} />
        </Form.Item>
        <Form.Item name="quality" label="文件质量" rules={[{ required: true }]}>
          <InputNumber placeholder="请输入1-100的数字" min={1} max={100} />
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default ConfigForm;

const Wrapper = styled.div`
  width: 300px;
`;
