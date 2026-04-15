import AddTokenDialog from "@/shared/components/dialogs/add-token-dialog";
import { Text, Flex } from "@siteground/styleguide";
import React, { useEffect, useMemo, useState } from "react";
import { PartialLoader } from "@/shared/components/partial-loader/partial-loader";
import i18n, { translate } from "i18n-calypso";
import PageHeader from "@/shared/components/page-header/page-header";
import DisconnectDialog from "@/shared/components/dialogs/disconnect-dialog";
import DateFormatter from "@/shared/components/date-formatter";
import "./styles.scss";
import { ColumnType } from "@siteground/styleguide/lib/components/table/table-body/types";
import Integration from "./integration/integration";
import ActivityLog from "./activity-log/activity-log";
import PowerAgent from "./power-agent/power-agent";
import PageLayout from "@/shared/components/page-layout/page-layout";
import { useAppSelector } from "@/store/hooks";
import { usePowermode } from "../hooks/use-powermode";
import { useActivityLogQuery, useDisconnectMutation } from "@/store/api/wp-api";
import { useCheckStatusQuery } from "@/store/api/wp-api";

const SettingsContainer: React.FC = () => {
  const config = useAppSelector((state) => state.app.config);
  const [currentPage, setCurrentPage] = useState(1);

  const { isPowerModeEnabled, isPowerModeLoading, handlePowerModeToggle } = usePowermode();

  const { data: activityLogData, isLoading: activityLogLoading } = useActivityLogQuery({
    page: currentPage,
    per_page: 10,
  });
  const { data: checkStatusData, isLoading: checkStatusLoading } = useCheckStatusQuery();
  const [disconnect, { isLoading: isDisconnectLoading }] = useDisconnectMutation();

  const columns: ColumnType[] = [
    {
      header: translate("Activity"),
      accessor: "activity",
      render: (action) => <Text weight="bold">{action}</Text>,
      mSize: "20%",
    },
    {
      header: translate("Details"),
      accessor: "message",
      render: (desc) => <Text>{desc}</Text>,
      mSize: "50%",
    },
    {
      header: translate("Date"),
      accessor: "date",
      mSize: "30%",
      render: (date) => {
        return <DateFormatter timestamp={date} />;
      },
    },
  ];

  const localeConfig = useMemo(() => {
    if (!config.locale) return { "": { localeSlug: config.localeSlug || "en" } };
    const locale = JSON.parse(config.locale);
    locale[""].localeSlug = config.localeSlug || "en";
    return locale;
  }, [config.locale, config.localeSlug]);

  useEffect(() => {
    i18n.setLocale(localeConfig);
  }, [localeConfig]);

  return (
    <PageLayout>
      <PartialLoader isLoadingAPIs={[isPowerModeLoading, activityLogLoading, checkStatusLoading, isDisconnectLoading]}>
        <Flex tabIndex={0} align="center" direction="column">
          <PageHeader
            title={translate("AI Studio")}
            description={translate(
              "Connect your WordPress site with the SiteGround AI Studio service. Chat with our AI agent to easily manage your WordPress site. Use the AI Studio text and image generative capabilities inside Gutenberg - experience the next-level editorial process."
            )}
            iconName="product-ai-tools"
          />

          <Integration isConnected={checkStatusData?.connected} />
          <PowerAgent
            enabled={isPowerModeEnabled}
            isConnected={checkStatusData?.connected}
            handlePowermodeToggle={handlePowerModeToggle}
          />
          <ActivityLog activityLog={activityLogData} columns={columns} onPageChange={setCurrentPage} />
        </Flex>
      </PartialLoader>

      <DisconnectDialog disconnect={disconnect} />
      <AddTokenDialog />
    </PageLayout>
  );
};

export default SettingsContainer;
