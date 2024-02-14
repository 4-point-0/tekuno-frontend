import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { saveAs } from "file-saver";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import {
  AlertTriangle,
  Copy,
  ExternalLink,
  Eye,
  Pencil,
  Report,
  Wallet,
} from "tabler-icons-react";

import { DownloadBadge } from "@/components/core/DownloadBadge";
import { FormattedHTML } from "@/components/core/FormattedHTML";
import { IndigoButton } from "@/components/core/IndigoButton";
import { NFTCard } from "@/components/core/NFTCard";
import {
  fetchCampaignControllerExportReport,
  useCampaignControllerFindOne,
} from "@/services/api/admin/adminComponents";
import { NftDto } from "@/services/api/admin/adminSchemas";
import { getCampaignAssets, hasEnded } from "@/utils/campaign";
import { formatDateRange } from "@/utils/date";
import { getImageUrl } from "@/utils/file";
import { notifications } from "@/utils/notifications";

import { CampaignStatus } from "../CampaignStatus";
import { DownloadAll } from "./DownloadAll";
import { QRPreview } from "./QRPreview";
import { StatusButtons } from "./StatusButtons";

export const CampaignDetails = () => {
  const router = useRouter();
  const [downloadingReport, setDownlaodingReport] = useState(false);

  const { data: campaign, isLoading } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const { image, documents, reward, nfts } = getCampaignAssets(campaign);

  const isEnded = campaign && hasEnded(campaign);

  const handleReportDownload = async () => {
    setDownlaodingReport(true);

    try {
      notifications.create({ title: "Fetching report" });
      const report = await fetchCampaignControllerExportReport({
        pathParams: { id: router.query.id as string },
      });

      saveAs(report as unknown as Blob, `${campaign?.name}_report`);
      notifications.success({ title: "Fetched report" });
    } catch (error) {
      console.error(error);
      notifications.error({ title: "Failed to download report" });
    } finally {
      setDownlaodingReport(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <Container>
          {campaign && (
            <Stack>
              <Skeleton
                visible={isLoading}
                w="100%"
                radius="lg"
                style={{ aspectRatio: 3 / 1 }}
              >
                <Box>
                  {campaign.chain.name === "sui" ? (
                    <Badge size="lg" variant="filled" color="cyan">
                      SUI Campaign
                    </Badge>
                  ) : (
                    <Badge size="lg" variant="filled" color="dark">
                      NEAR Campaign
                    </Badge>
                  )}
                </Box>
                <Box mt={"md"}>
                  <Image src={getImageUrl(image)} radius="lg" alt="" />
                </Box>
              </Skeleton>

              <Box>
                <Group>
                  {campaign && (
                    <CampaignStatus status={campaign?.status} size="lg" />
                  )}
                  <Title order={2}>{campaign?.name}</Title>
                </Group>
                <Text c="dimmed">
                  {formatDateRange(
                    campaign?.start_date as string,
                    campaign?.end_date
                  )}
                </Text>
              </Box>

              <Group position="right">
                {campaign?.status === "Created" && !isEnded && (
                  <>
                    <IndigoButton
                      component="a"
                      href={`${location.origin}/admin/previous/${router.query.id}/preview`}
                      target="_blank"
                      rel="norefferer"
                      leftIcon={<Eye size={14} />}
                    >
                      Preview
                    </IndigoButton>
                    <Button
                      component={Link}
                      href={`/admin/previous/${router.query.id}/edit`}
                      leftIcon={<Pencil size={14} />}
                      color="dark"
                    >
                      Edit
                    </Button>
                    <Button
                      component={Link}
                      href={`/admin/previous/${router.query.id}/duplicate?type=${campaign.campaign_type.name}`}
                      leftIcon={<Copy size={14} />}
                      color="dark"
                    >
                      Duplicate Campaign
                    </Button>
                  </>
                )}
                {campaign?.status !== "Created" && (
                  <>
                    <IndigoButton
                      loaderPosition="right"
                      loading={downloadingReport}
                      rightIcon={<Report size={14} />}
                      onClick={handleReportDownload}
                    >
                      Download report
                    </IndigoButton>
                    <IndigoButton
                      component="a"
                      href={`${location.origin}/campaign/${router.query.id}`}
                      target="_blank"
                      rel="norefferer"
                      referrerPolicy="no-referrer"
                      leftIcon={<ExternalLink size={14} />}
                    >
                      Open campaign
                    </IndigoButton>
                    <Button
                      component={Link}
                      href={`/admin/previous/${router.query.id}/duplicate?type=${campaign.campaign_type.name}`}
                      leftIcon={<Copy size={14} />}
                      color="dark"
                    >
                      Duplicate Campaign
                    </Button>
                  </>
                )}

                {!campaign.campaign_order && (
                  <Button
                    component={Link}
                    href={`/admin/activation/order/${campaign.id}`}
                    leftIcon={<Wallet size={14} />}
                    color="dark"
                  >
                    Make a payment
                  </Button>
                )}

                {campaign.campaign_order !== null && (
                  <StatusButtons campaign={campaign} />
                )}
              </Group>

              {campaign?.description && (
                <FormattedHTML fz="lg" content={campaign.description} />
              )}
              {campaign?.additional_description && (
                <FormattedHTML
                  fz="sm"
                  content={campaign.additional_description}
                />
              )}

              {documents?.length !== 0 && (
                <Group position="apart" align="flex-start" noWrap>
                  <Group miw={200}>
                    <Title order={4}>Project documents</Title>
                  </Group>

                  <Group position="right">
                    {documents?.map((document) => (
                      <DownloadBadge key={document.id} document={document} />
                    ))}
                  </Group>
                </Group>
              )}

              <Group position="apart">
                <Title order={4}>Digital collectibles</Title>
                {campaign && (nfts?.length || 0) > 1 && (
                  <DownloadAll campaign={campaign} nfts={nfts as NftDto[]} />
                )}
              </Group>

              {!isEnded && campaign?.status === "Created" && (
                <Alert
                  icon={<AlertTriangle />}
                  title="Campaign not started!"
                  color="orange"
                  radius="md"
                >
                  Start campaign so digital collectibles can be claimed.
                </Alert>
              )}

              <Grid align="center">
                {reward && (
                  <Grid.Col span={12}>
                    <NFTCard nft={reward} />
                  </Grid.Col>
                )}

                {nfts?.map((nft) => (
                  <Fragment key={nft.id}>
                    <Grid.Col span={7}>
                      <NFTCard key={nft.id} nft={nft} />
                    </Grid.Col>
                    <Grid.Col span={5}>
                      <QRPreview nft={nft} />
                    </Grid.Col>
                  </Fragment>
                ))}
              </Grid>
            </Stack>
          )}
        </Container>
      </Paper>
    </Container>
  );
};
