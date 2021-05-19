import { AddressZero } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import { Button, Form, Input, Row, Col, message, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BulksaleV1Json from '../../abis/BulksaleV1.json';
import FactoryJson from '../../abis/Factory.json';
import { Container, Main } from '../../components/Layout';
import { H1 } from '../../components/Layout';
import { FACTORY_CONTRACT_ADDRESS } from '../../constants/contracts';
import {
  calculateGasMargin,
  getContract,
  useActiveWeb3React,
} from '../../hooks/useWeb3';
import { getAbiArgs } from '../../utils/web3';

export default function EventEditorCreate() {
  const [data, setData] = useState({} as any);
  const { library, account, active } = useActiveWeb3React();
  const location = useLocation();

  async function onFinish(values: any) {
    console.log(
      'Received values from form: ',
      values,
      library?.network,
      account
    );
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
      FactoryJson.abi,
      library
    );
    const signer = contract.connect(library.getSigner());

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

    try {
      // const estimatedGasLimit = await contract.estimateGas['deploy'](
      //   ...args,
      //   {}
      // );
      // console.log('ガス', estimatedGasLimit);

      signer
        .deploy(...args)
        .then((res: any) => {
          console.log('deploy結果', res);
          message.info(`作成しました！　${res}`);
        })
        .catch((error: any) => {
          console.error('deploy結果', error);
          message.warning(
            `作成できませんでした。。　${error.message.substring(0, 20)}...`
          );
        });
    } catch (error) {
      console.error(error);
      message.error(
        `エラーが発生しました。。　${error.message.substring(0, 20)}...`
      );
    }

    // contract.estimateGas['deploy'](...args, {})
    //   .then((estimatedGasLimit) => {
    //     console.log('ガス', estimatedGasLimit);
    //     return signer.deploy(...args).then((response: TransactionResponse) => {
    //       // addTransaction(response, {
    //       //   summary: `Claimed ${unclaimedAmount?.toSignificant(4)} UNI`,
    //       //   claim: { recipient: account },
    //       // });
    //       return response.hash;
    //     });
    //   })
    //   .catch((error) => console.error(error));
  }

  function onClickCheckTemplate(values: any) {
    console.log('check template', values);
    if (!library || !account)
      return message.error('ウォレットを接続してください');

    const contract = getContract(
      FACTORY_CONTRACT_ADDRESS,
      FactoryJson.abi,
      library
    );

    contract.templates(values.templateName).then((address: any) => {
      console.log('template', address);
      if (address === AddressZero) {
        message.warning(`templateは未登録です。${address}`);
      } else {
        message.info(`templateは登録されています。${address}`);
      }
    });
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
        <H1>イベント編集</H1>

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

        <Form
          name="fundraiser_form_controls"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          onFinish={onClickCheckTemplate}
        >
          <Form.Item
            label="TemplateName"
            name="templateName"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" shape="round" htmlType="submit">
              テンプレートがセットされている確認する
            </Button>
          </Form.Item>
        </Form>

        <Link to="/">back</Link>
      </Main>
    </Container>
  );
}
