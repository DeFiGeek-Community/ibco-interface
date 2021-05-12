import { TransactionResponse } from '@ethersproject/providers';
import { Button, Form, Input, Row, Col, message, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FactoryAbi from '../../abis/Factory.json';
import { Container, Main } from '../../components/Layout';
import { FACTORY_CONTRACT_ADDRESS } from '../../constants/contracts';
import {
  calculateGasMargin,
  getContract,
  useActiveWeb3React,
} from '../../hooks/useWeb3';
import { getAbiArgs } from '../../utils/web3';

export default function EventEditorCreate() {
  const [data, setData] = useState({} as any);
  const { library, account } = useActiveWeb3React();
  const location = useLocation();

  function onFinish(values: any) {
    console.log('Received values from form: ', values, library, account);
    if (!library || !account)
      return message.error('ウォレットを接続してください');

    const {
      templateName,
      tokenAddress,
      sellingAmount,
      startDate,
      eventDuration,
      lockDuration,
      expirationDuration,
      minEtherTarget,
      feeRate,
    } = values;

    const contract = getContract(
      FACTORY_CONTRACT_ADDRESS,
      FactoryAbi.abi,
      library
    );
    const argsForClone = getAbiArgs(templateName, {
      token: tokenAddress,
      start: Number(startDate),
      eventDuration: Number(eventDuration),
      lockDuration: Number(lockDuration),
      expirationDuration: Number(expirationDuration),
      sellingAmount: Number(sellingAmount),
      minEtherTarget: Number(minEtherTarget),
      owner: account,
      feeRatePerMil: Number(feeRate),
    });
    const args = [
      templateName,
      tokenAddress,
      Number(sellingAmount),
      argsForClone,
    ];

    console.log('コントラクト', contract, args);

    return contract.estimateGas['deploy'](...args, { gasLimit: 250000 })
      .then((estimatedGasLimit) => {
        console.log('ガス', estimatedGasLimit);
        // return contract
        //   .deploy(...args, {
        //     value: null,
        //     gasLimit: calculateGasMargin(estimatedGasLimit),
        //   })
        //   .then((response: TransactionResponse) => {
        //     // addTransaction(response, {
        //     //   summary: `Claimed ${unclaimedAmount?.toSignificant(4)} UNI`,
        //     //   claim: { recipient: account },
        //     // });
        //     return response.hash;
        //   });
      })
      .catch((error) => console.error(error));
  }

  return (
    <Container>
      <Helmet>
        <title>イベント編集</title>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <div style={{ textAlign: 'right', width: '100%' }}>
        <Button type="primary" style={{ margin: '24px 24px 0' }}>
          Connect to a wallet
        </Button>
      </div>

      <Main>
        <Form
          name="fundraiser_form_controls"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="TemplateName"
            name="templateName"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="TokenAddress"
            name="tokenAddress"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="SellingAmount"
            name="sellingAmount"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Start"
            name="startDate"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="EventDuration"
            name="eventDuration"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="LockDuration"
            name="lockDuration"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="ExpirationDuration"
            name="expirationDuration"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="MinEtherTarget"
            name="minEtherTarget"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="FeeRate"
            name="feeRate"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item>
            <Button type="primary" shape="round" htmlType="submit">
              イベントを作る
            </Button>
          </Form.Item>
        </Form>

        <Link to="/">back</Link>
      </Main>
    </Container>
  );
}
