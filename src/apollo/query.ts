import { gql } from '@apollo/client';

export const EVENT_INFO_QUERY = gql`
  query GetEventInfo($id: ID!) {
    eventInfo(id: $id) {
      START
      END
      TOTAL_DISTRIBUTE_AMOUNT
      MINIMAL_PROVIDE_AMOUNT
      totalProvided
    }
  }
`;
