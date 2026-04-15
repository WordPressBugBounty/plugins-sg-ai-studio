import { FC } from "react";
import { Section, Flex, Title, ActionTable } from "@siteground/styleguide";
import { translate } from "i18n-calypso";
import { ColumnType } from "@siteground/styleguide/lib/components/table/table-body/types";
import { ActivityLogResponse } from "@/store/api/wp-api";
import { TablePagination } from "./table-pagination";
import { RenderIf } from "@/shared/components/render-if/render-if";

interface Props {
  activityLog: ActivityLogResponse;
  columns: ColumnType[];
  onPageChange: (page: number) => void;
}

const ActivityLog: FC<Props> = ({ activityLog, columns, onPageChange }) => {
  const { entries, total, page, per_page, total_pages } = activityLog || {};

  return (
    <Section>
      <Flex gap="x-small" direction="column">
        <Title level="4">{translate("Activity Log")}</Title>
        <ActionTable
          key={`activity-log-page-${page}`}
          shadow
          data={entries || []}
          columns={columns}
          renderAfterTableContent={() => (
            <RenderIf condition={total > per_page}>
              <TablePagination
                page={page}
                itemsPerPage={per_page}
                totalPages={total_pages}
                totalItems={total}
                onChange={onPageChange}
              />
            </RenderIf>
          )}
        />
      </Flex>
    </Section>
  );
};

export default ActivityLog;
