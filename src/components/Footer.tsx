import styled from 'styled-components';

export type ReferenceList = {
  forum?: string;
  discord?: string;
  github?: string;
};

export default function Footer(props: { referenceList?: ReferenceList }) {
  const { referenceList } = props;
  return (
    <StyledFooter>
      <ProjectName>© DeFiGeek Community JAPAN</ProjectName>
      <FooterItem>
        {referenceList && referenceList.forum && (
          <a
            href={referenceList.forum}
            target="_blank"
            rel="noopener noreferrer"
          >
            Forum{' '}
          </a>
        )}
        {referenceList && referenceList.discord && (
          <a
            href={referenceList.discord}
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord{' '}
          </a>
        )}
        {referenceList && referenceList.github && (
          <a
            href={referenceList.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub{' '}
          </a>
        )}
      </FooterItem>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
`;

const ProjectName = styled.div`
  text-align: center;
  padding-top: 1rem;
`;

const FooterItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 20px;
`;
