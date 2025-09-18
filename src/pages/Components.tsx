import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';
import {
  Button,
  Input,
  Checkbox,
  Toggle,
  Select,
  Card,
  Modal,
  Dialog,
  Tabs,
  Accordion,
  Skeleton,
  ToastContainer,
  showToast,
} from '../components/common';

const ComponentsPageContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  padding: ${theme.spacing.xl};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 ${theme.spacing.md} 0;
  background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto ${theme.spacing.xl} auto;
`;

const SearchInput = styled(Input)`
  width: 100%;
`;

const Navigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  justify-content: center;
  margin-bottom: ${theme.spacing.xl};
`;

const NavButton = styled(Button)<{ isActive?: boolean }>`
  ${props => props.isActive && `
    background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
    color: white;
  `}
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled(motion.section)`
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.text};
`;

const SectionDescription = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.lg} 0;
  line-height: 1.6;
`;

const ExampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const ExampleCard = styled(Card)`
  padding: ${theme.spacing.lg};
`;

const ExampleTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text};
`;

const ExampleDescription = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 0.875rem;
`;

const CodeBlock = styled.pre`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: ${theme.colors.text};
  margin: ${theme.spacing.md} 0;
`;

const PropsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${theme.spacing.lg};
`;

const PropsTableHeader = styled.th`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md};
  text-align: left;
  border: 1px solid ${theme.colors.border};
  font-weight: 600;
  color: ${theme.colors.text};
`;

const PropsTableCell = styled.td`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  vertical-align: top;
`;

const PropsTableCode = styled.code`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: ${theme.colors.primary};
`;

const DemoButton = styled(Button)`
  margin: ${theme.spacing.sm};
`;

const DemoInput = styled(Input)`
  margin: ${theme.spacing.sm};
`;

const DemoSelect = styled(Select)`
  margin: ${theme.spacing.sm};
`;

const DemoCard = styled(Card)`
  margin: ${theme.spacing.sm};
  max-width: 300px;
`;

const DemoModal = styled(Modal)``;

const DemoDialog = styled(Dialog)``;

const DemoToast = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin: ${theme.spacing.sm} 0;
`;

const DemoAccordion = styled(Accordion)`
  margin: ${theme.spacing.sm} 0;
`;

const DemoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  align-items: center;
  margin: ${theme.spacing.md} 0;
`;

const ComponentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('buttons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sections = [
    { id: 'buttons', title: 'Buttons', component: 'Button' },
    { id: 'inputs', title: 'Inputs', component: 'Input' },
    { id: 'selection', title: 'Selection', component: 'Checkbox' },
    { id: 'containers', title: 'Containers', component: 'Card' },
    { id: 'navigation', title: 'Navigation', component: 'Tabs' },
    { id: 'feedback', title: 'Feedback', component: 'Skeleton' },
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.component.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buttonVariants = [
    { variant: 'primary', label: 'Primary' },
    { variant: 'secondary', label: 'Secondary' },
    { variant: 'outline', label: 'Outline' },
    { variant: 'ghost', label: 'Ghost' },
  ];

  const buttonSizes = [
    { size: 'sm', label: 'Small' },
    { size: 'md', label: 'Medium' },
    { size: 'lg', label: 'Large' },
  ];

  const inputVariants = [
    { variant: 'default', label: 'Default' },
    { variant: 'filled', label: 'Filled' },
    { variant: 'outlined', label: 'Outlined' },
  ];

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const accordionItems = [
    {
      id: '1',
      title: 'What is this component library?',
      content: 'This is a comprehensive UI component library built with React, TypeScript, and styled-components, featuring Netflix-inspired styling and animations.',
    },
    {
      id: '2',
      title: 'How do I use these components?',
      content: 'Simply import the components from the common folder and use them in your React application. All components are fully typed with TypeScript.',
    },
    {
      id: '3',
      title: 'Are these components accessible?',
      content: 'Yes! All components include proper ARIA attributes, keyboard navigation support, and screen reader compatibility.',
    },
  ];

  const tabItems = [
    {
      id: 'tab1',
      label: 'Overview',
      content: (
        <div>
          <h3>Component Overview</h3>
          <p>This component library provides a comprehensive set of UI components with consistent styling and behavior.</p>
        </div>
      ),
    },
    {
      id: 'tab2',
      label: 'Usage',
      content: (
        <div>
          <h3>Usage Examples</h3>
          <p>Here are some examples of how to use the components in your application.</p>
        </div>
      ),
    },
    {
      id: 'tab3',
      label: 'API',
      content: (
        <div>
          <h3>API Reference</h3>
          <p>Detailed API documentation for all component props and methods.</p>
        </div>
      ),
    },
  ];

  return (
    <ComponentsPageContainer>
      <ToastContainer />
      
      <Header>
        <Title>Component Library</Title>
        <Subtitle>
          A comprehensive collection of reusable UI components with Netflix-inspired styling
        </Subtitle>
      </Header>

      <SearchContainer>
        <SearchInput
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <Navigation>
        {filteredSections.map((section) => (
          <NavButton
            key={section.id}
            variant={activeSection === section.id ? 'primary' : 'ghost'}
            onClick={() => setActiveSection(section.id)}
            isActive={activeSection === section.id}
          >
            {section.title}
          </NavButton>
        ))}
      </Navigation>

      <Content>
        {activeSection === 'buttons' && (
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Buttons</SectionTitle>
            <SectionDescription>
              Buttons are used to trigger actions and navigate through the interface. 
              They come in various sizes and styles to fit different use cases.
            </SectionDescription>

            <ExampleGrid>
              <ExampleCard>
                <ExampleTitle>Variants</ExampleTitle>
                <ExampleDescription>Different button styles for various contexts</ExampleDescription>
                <DemoContainer>
                  {buttonVariants.map(({ variant, label }) => (
                    <DemoButton key={variant} variant={variant as any}>
                      {label}
                    </DemoButton>
                  ))}
                </DemoContainer>
              </ExampleCard>

              <ExampleCard>
                <ExampleTitle>Sizes</ExampleTitle>
                <ExampleDescription>Three different sizes available</ExampleDescription>
                <DemoContainer>
                  {buttonSizes.map(({ size, label }) => (
                    <DemoButton key={size} size={size as any}>
                      {label}
                    </DemoButton>
                  ))}
                </DemoContainer>
              </ExampleCard>
            </ExampleGrid>

            <CodeBlock>
{`import { Button } from '../components/common';

<Button variant="primary" size="md">
  Click me
</Button>`}
            </CodeBlock>

            <PropsTable>
              <thead>
                <tr>
                  <PropsTableHeader>Prop</PropsTableHeader>
                  <PropsTableHeader>Type</PropsTableHeader>
                  <PropsTableHeader>Default</PropsTableHeader>
                  <PropsTableHeader>Description</PropsTableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <PropsTableCell><PropsTableCode>variant</PropsTableCode></PropsTableCell>
                  <PropsTableCell><PropsTableCode>'primary' | 'secondary' | 'outline' | 'ghost'</PropsTableCode></PropsTableCell>
                  <PropsTableCell><PropsTableCode>'primary'</PropsTableCode></PropsTableCell>
                  <PropsTableCell>The visual style variant of the button</PropsTableCell>
                </tr>
                <tr>
                  <PropsTableCell><PropsTableCode>size</PropsTableCode></PropsTableCell>
                  <PropsTableCell><PropsTableCode>'sm' | 'md' | 'lg'</PropsTableCode></PropsTableCell>
                  <PropsTableCell><PropsTableCode>'md'</PropsTableCode></PropsTableCell>
                  <PropsTableCell>The size of the button</PropsTableCell>
                </tr>
                <tr>
                  <PropsTableCell><PropsTableCode>loading</PropsTableCode></PropsTableCell>
                  <PropsTableCell><PropsTableCode>boolean</PropsTableCode></PropsTableCell>
                  <PropsTableCell><PropsTableCode>false</PropsTableCode></PropsTableCell>
                  <PropsTableCell>Shows loading spinner when true</PropsTableCell>
                </tr>
              </tbody>
            </PropsTable>
          </Section>
        )}

        {activeSection === 'inputs' && (
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Inputs</SectionTitle>
            <SectionDescription>
              Input components for collecting user data. Includes text inputs, checkboxes, toggles, and select dropdowns.
            </SectionDescription>

            <ExampleGrid>
              <ExampleCard>
                <ExampleTitle>Input Variants</ExampleTitle>
                <ExampleDescription>Different input field styles</ExampleDescription>
                <div>
                  {inputVariants.map(({ variant, label }) => (
                    <DemoInput
                      key={variant}
                      variant={variant as any}
                      placeholder={`${label} input`}
                      label={`${label} Input`}
                    />
                  ))}
                </div>
              </ExampleCard>

              <ExampleCard>
                <ExampleTitle>Form Controls</ExampleTitle>
                <ExampleDescription>Checkboxes, toggles, and selects</ExampleDescription>
                <div>
                  <Checkbox label="Accept terms and conditions" />
                  <Toggle label="Enable notifications" />
                  <DemoSelect
                    options={selectOptions}
                    placeholder="Choose an option"
                    label="Select Option"
                  />
                </div>
              </ExampleCard>
            </ExampleGrid>
          </Section>
        )}

        {activeSection === 'containers' && (
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Containers</SectionTitle>
            <SectionDescription>
              Container components for organizing content and creating interactive overlays.
            </SectionDescription>

            <ExampleGrid>
              <ExampleCard>
                <ExampleTitle>Cards</ExampleTitle>
                <ExampleDescription>Content containers with hover effects</ExampleDescription>
                <DemoCard hoverable>
                  <Card.Header>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Subtitle>Card subtitle</Card.Subtitle>
                  </Card.Header>
                  <Card.Content>
                    This is the card content with some example text.
                  </Card.Content>
                  <Card.Footer>
                    <Card.Actions>
                      <Button size="sm">Action</Button>
                    </Card.Actions>
                  </Card.Footer>
                </DemoCard>
              </ExampleCard>

              <ExampleCard>
                <ExampleTitle>Modals & Dialogs</ExampleTitle>
                <ExampleDescription>Overlay components for important interactions</ExampleDescription>
                <DemoContainer>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Open Modal
                  </Button>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    Open Dialog
                  </Button>
                </DemoContainer>
              </ExampleCard>
            </ExampleGrid>

            <DemoModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
            >
              <p>This is an example modal with some content.</p>
              <Button onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DemoModal>

            <DemoDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Confirm Action"
              message="Are you sure you want to proceed with this action?"
              variant="warning"
            >
              <Dialog.Actions>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Confirm
                </Button>
              </Dialog.Actions>
            </DemoDialog>
          </Section>
        )}

        {activeSection === 'navigation' && (
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Navigation</SectionTitle>
            <SectionDescription>
              Navigation components for organizing and displaying content in structured ways.
            </SectionDescription>

            <ExampleGrid>
              <ExampleCard>
                <ExampleTitle>Tabs</ExampleTitle>
                <ExampleDescription>Tabbed navigation with animated indicators</ExampleDescription>
                <Tabs tabs={tabItems} />
              </ExampleCard>

              <ExampleCard>
                <ExampleTitle>Accordion</ExampleTitle>
                <ExampleDescription>Collapsible content sections</ExampleDescription>
                <DemoAccordion items={accordionItems} />
              </ExampleCard>
            </ExampleGrid>
          </Section>
        )}

        {activeSection === 'feedback' && (
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Feedback</SectionTitle>
            <SectionDescription>
              Components for providing feedback to users through loading states and notifications.
            </SectionDescription>

            <ExampleGrid>
              <ExampleCard>
                <ExampleTitle>Skeleton Loaders</ExampleTitle>
                <ExampleDescription>Loading placeholders for content</ExampleDescription>
                <div>
                  <Skeleton width={200} height={20} />
                  <Skeleton.Text lines={3} />
                  <Skeleton.Card />
                </div>
              </ExampleCard>

              <ExampleCard>
                <ExampleTitle>Toast Notifications</ExampleTitle>
                <ExampleDescription>Non-intrusive notifications</ExampleDescription>
                <DemoToast>
                  <Button onClick={() => showToast.success('Success message!')}>
                    Success
                  </Button>
                  <Button onClick={() => showToast.error('Error message!')}>
                    Error
                  </Button>
                  <Button onClick={() => showToast.warning('Warning message!')}>
                    Warning
                  </Button>
                  <Button onClick={() => showToast.info('Info message!')}>
                    Info
                  </Button>
                </DemoToast>
              </ExampleCard>
            </ExampleGrid>
          </Section>
        )}
      </Content>
    </ComponentsPageContainer>
  );
};

export default ComponentsPage;
