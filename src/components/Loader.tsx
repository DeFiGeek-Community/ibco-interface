import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Loader(
  props: { fontSize?: number } = { fontSize: 24 }
) {
  return (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: props.fontSize }} spin />}
    />
  );
}
