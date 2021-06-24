import { Button, Form, Input, message, notification } from 'antd';
import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { targetedChain, targetedChainId } from '../../../../constants/chains';
import { useFirstEventContract } from '../../../../hooks/useContract';
import { useActiveWeb3React } from '../../../../hooks/useWeb3';
import { useEndTx, useStartTx } from '../../../../state/application/hooks';
import { getEtherscanLink } from '../../../../utils/externalLink';
import { parseEther } from '../../../../utils/web3';
import { ExternalLink } from '../../../ExternalLink';
import { Grid } from '../../../Layout';

export function getInputValue(value: any): number {
  const val = value ?? 0;
  let newVal = 0;
  try {
    newVal = Number(val);
    if (Number.isNaN(newVal)) {
      newVal = 0;
    }
  } catch (error) {
    newVal = 0;
  }
  return newVal;
}

export const ErrorMessageForZero = '0以上を入力してください。';
export const ErrorMessageForDigits = '小数点は18桁までです。';
export function checkPrice(_: any, value: string): Promise<number> {
  const val = getInputValue(value);
  if (val <= 0) {
    return Promise.reject(ErrorMessageForZero);
  }
  const numbers = value.toString().split('.');
  if (numbers[1] && numbers[1].length > 18) {
    return Promise.reject(ErrorMessageForDigits);
  }

  return Promise.resolve(val);
}

type Props = {
  isStarting: boolean;
  isEnding: boolean;
  myTotalProvided: number;
  providedTokenSymbol: string;
  setCopiedInputNumber: (value: number) => void;
};

export default function InputForm({
  isStarting,
  isEnding,
  myTotalProvided,
  providedTokenSymbol,
  setCopiedInputNumber,
}: Props) {
  const { library, account, active, chainId } = useActiveWeb3React();
  const [form] = Form.useForm();
  const contract = useFirstEventContract();

  // handle loading status
  const startTx = useStartTx();
  const endTx = useEndTx();

  const onFinish = useCallback(
    async (values: any) => {
      if (!active || !account || !library) {
        message.error(`ウォレットを接続してください。`);
        return;
      }
      if (targetedChainId !== chainId || !contract) {
        message.error(`ネットワークを${targetedChain}に接続してください。`);
        return;
      }

      try {
        startTx();

        const signer = library.getSigner();
        const res = await signer.sendTransaction({
          to: contract.address,
          value: parseEther(values.price),
        });

        console.log('donation result', res);
        notification.success({
          message: '寄付を受け付けました！',
          description: (
            <>
              <ExternalLink
                href={getEtherscanLink(chainId, res.hash, 'transaction')}
              >
                {res.hash}
              </ExternalLink>
              <p>寄付額への反映は数confirmation後になります。</p>
            </>
          ),
        });

        // reset
        form.resetFields();
        setCopiedInputNumber(0);
      } catch (error) {
        console.error('donation failed!', error);
        if (error.message) {
          if (
            (error.message as string).search('The offering has not started') >
            -1
          ) {
            message.warning(`まだ始まっていません。`, 5);
            return;
          }
          if (
            (error.message as string).search('The offering has already ended') >
            -1
          ) {
            message.warning(`終了しました。`, 5);
            return;
          }
          if ((error.message as string).search('insufficient funds') > -1) {
            message.warning(`残高が足りません。`, 5);
            return;
          }
        }

        notification.error({
          message: 'エラーが発生しました。。',
          description: error.messages,
        });
      } finally {
        endTx();
      }
    },
    [
      form,
      active,
      account,
      library,
      chainId,
      contract,
      startTx,
      endTx,
      setCopiedInputNumber,
    ]
  );

  const claim = useCallback(async () => {
    if (!active || !account || !library) {
      message.error(`ウォレットを接続してください。`, 5);
      return;
    }
    if (targetedChainId !== chainId || !contract) {
      message.error(`ネットワークを${targetedChain}に接続してください。`, 5);
      return;
    }
    if (myTotalProvided <= 0) {
      message.info(`あなた（${account}）の寄付額は0です。`, 5);
      return;
    }

    try {
      startTx();

      const signer = contract.connect(library.getSigner());
      const res = await signer.claim();

      console.log('claim result', res);
      notification.success({
        message: '請求を受け付けました！',
        description: (
          <>
            <ExternalLink
              href={getEtherscanLink(chainId, res.hash, 'transaction')}
            >
              {res.hash}
            </ExternalLink>
          </>
        ),
      });
    } catch (error) {
      console.error('claim error!', error);
      notification.error({
        message: 'エラーが発生しました。。',
        description: error.messages,
      });
    } finally {
      endTx();
    }
  }, [
    active,
    account,
    library,
    chainId,
    myTotalProvided,
    contract,
    startTx,
    endTx,
  ]);

  const copyInputValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNumber = getInputValue(e.target.value);
      setCopiedInputNumber(newNumber);
    },
    [setCopiedInputNumber]
  );

  return (
    <>
      {isStarting && !isEnding && (
        <Grid>
          <Form
            name="fundraiser_form_controls"
            layout="inline"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              name="price"
              rules={[{ validator: checkPrice }]}
              style={{
                width: !isMobile ? '300px' : 'calc(100vw - 40px)',
                marginLeft: '16px',
                marginRight: '16px',
                textAlign: 'right',
              }}
            >
              <Input
                type="text"
                onChange={copyInputValue}
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />
            </Form.Item>
            <Form.Item>
              {!isMobile ?? providedTokenSymbol.toUpperCase()}
            </Form.Item>
            <Form.Item
              style={
                isMobile
                  ? {
                      margin: '16px auto',
                    }
                  : {}
              }
            >
              <Button type="primary" shape="round" htmlType="submit">
                寄付する
              </Button>
            </Form.Item>
          </Form>
        </Grid>
      )}

      {isEnding && (
        <Grid>
          <Button
            type="primary"
            shape="round"
            htmlType="button"
            onClick={claim}
          >
            請求する
          </Button>
        </Grid>
      )}
    </>
  );
}
