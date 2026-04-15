import { FC } from "react";
import { Grid, IconButton, Text } from "@siteground/styleguide";
import { translate } from "i18n-calypso";

export interface PaginationProps {
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  page: number;
  onChange: (page: number) => void;
}

const calculatePaginationProps = ({ itemsPerPage, page }) => {
  if (page <= 1) {
    return {
      fromItem: page,
      toItem: itemsPerPage,
    };
  }

  return {
    fromItem: (page - 1) * itemsPerPage + 1,
    toItem: page * itemsPerPage,
  };
};

export const TablePagination: FC<PaginationProps> = (props) => {
  const { itemsPerPage, totalItems, page, totalPages, onChange } = props;
  const { fromItem, toItem } = calculatePaginationProps({ itemsPerPage, page });

  const areLeftArrowsDisabled = page === 1;
  const areRightArrowsDisabled = page >= totalPages;
  const toItemToDisplay = toItem <= totalItems ? toItem : totalItems;

  return (
    <Grid
      gap="medium"
      align="center"
      autoflow="column"
      style={{ visibility: totalItems ? "visible" : "hidden", justifyContent: "flex-end" }}
    >
      <Text>
        {translate("%(fromItem)d-%(toItem)d of %(totalItems)d", {
          args: {
            fromItem,
            toItem: toItemToDisplay,
            totalItems,
          },
        })}
      </Text>

      <div>
        <span>
          <IconButton
            icon="material/keyboard_double_arrow_left"
            size="small"
            onClick={() => onChange(1)}
            disabled={areLeftArrowsDisabled}
            tooltip={translate("Go to first page")}
          />
        </span>

        <span>
          <IconButton
            icon="material/keyboard_arrow_left"
            size="small"
            onClick={() => onChange(Math.max(page - 1, 1))}
            disabled={areLeftArrowsDisabled}
            tooltip={translate("Go to previous page")}
          />
        </span>

        <span>
          <IconButton
            icon="material/keyboard_arrow_right"
            size="small"
            onClick={() => onChange(Math.min(page + 1, totalPages))}
            disabled={areRightArrowsDisabled}
            tooltip={translate("Go to next page")}
          />
        </span>

        <span>
          <IconButton
            icon="material/keyboard_double_arrow_right"
            size="small"
            onClick={() => onChange(totalPages)}
            disabled={areRightArrowsDisabled}
            tooltip={translate("Go to last page")}
          />
        </span>
      </div>
    </Grid>
  );
};
