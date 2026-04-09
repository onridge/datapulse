import { gql } from "graphql-request";

export const GET_ANALYTICS = gql`
  query Analytics {
    analytics {
      stats {
        mrr
        mrrChange
        churnRate
        churnChange
        retention
        retentionChange
        ltv
        ltvChange
      }
      trend {
        month
        current
        previous
      }
      funnel {
        label
        value
        pct
        color
      }
      topPages {
        page
        views
        bounce
        bouncePos
        avgTime
      }
      traffic {
        label
        pct
        color
      }
    }
  }
`;
