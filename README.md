```angular2html
├─public
└─src
    ├─api ## API 관련 폴더
    ├─components
    │  │  TopFilters.module.css
    │  │  TopFilters.tsx
    │  │
    │  ├─Card
    │  │      Card.module.css
    │  │      Card.tsx
    │  │
    │  ├─Chart
    │  │      AreaChart.tsx
    │  │      BarChart.tsx
    │  │      BigNumberChart.module.css
    │  │      BigNumberChart.tsx
    │  │      Chart.module.css
    │  │      CostChart.tsx
    │  │      HistogramChart.tsx
    │  │      LineChart.tsx
    │  │      PieChart.tsx
    │  │      PivotTableChart.module.css
    │  │      PivotTableChart.tsx
    │  │      TraceChart.module.css
    │  │      TraceChart.tsx
    │  │
    │  ├─ChatBox
    │  │      ChatBox.module.css
    │  │      ChatBox.tsx
    │  │
    │  ├─Dashboard
    │  │      WidgetCard.module.css
    │  │      WidgetCard.tsx
    │  │
    │  ├─DataTable
    │  │      DataTable.module.css
    │  │      DataTable.tsx
    │  │
    │  ├─Form
    │  │      FormGroup.module.css
    │  │      FormGroup.tsx
    │  │
    │  ├─Layouts
    │  │      FormPageLayout.module.css
    │  │      FormPageLayout.tsx
    │  │
    │  ├─LineNumberedTextarea
    │  │      LineNumberedTextarea.module.css
    │  │      LineNumberedTextarea.tsx
    │  │
    │  ├─Modal
    │  │      Modal.module.css
    │  │      Modal.jsx
    │  │
    │  ├─PageHeader
    │  │      PageHeader.module.css
    │  │      PageHeader.tsx
    │  │
    │  └─SidePanel
    │          SidePanel.module.css
    │          SidePanel.jsx
    │
    ├─data
    │      dummyDashboardData.ts
    │      dummyDashboardDetailData.ts
    │      dummyEvaluations.ts
    │      dummyPromptDetails.ts
    │      dummyPrompts.ts
    │      dummySessions.ts
    │      dummySessionsData.ts
    │      dummySpans.ts
    │      dummyTraces.ts
    │      dummyWidgetData.ts
    │
    ├─layouts
    │      ColumnMenu.module.css
    │      ColumnMenu.tsx
    │      Header.module.css
    │      Header.tsx
    │      Layout.module.css
    │      Layout.tsx
    │      ProjectHeader.module.css
    │      ProjectHeader.tsx
    │      SettingsSidebar.jsx
    │      SettingsSidebar.module.css
    │
    ├─lib
    │      langfuse.ts
    │
    └─pages
        │  Main.jsx
        │
        ├─Dashboard
        │      DashboardDetail.module.css
        │      DashboardDetail.tsx
        │      DashboardNew.tsx
        │      Dashboards.module.css
        │      Dashboards.tsx
        │      DashboardsView.tsx
        │      WidgetNew.module.css
        │      WidgetNew.tsx
        │      WidgetNewPopup.module.css
        │      WidgetNewPopup.tsx
        │      WidgetsView.tsx
        │
        ├─Evaluation
        │  ├─DataSets
        │  │      DatasetsPage.module.css
        │  │      DatasetsPage.tsx
        │  │
        │  └─Judge
        │          JudgePage.module.css
        │          JudgePage.tsx
        │          JudgePageNew.module.css
        │          JudgePageNew.tsx
        │
        ├─Home
        │      Home.module.css
        │      Home.tsx
        │
        ├─Playground
        │      NewItemModal.module.css
        │      NewItemModal.tsx
        │      NewLlmConnectionModal.module.css
        │      NewLlmConnectionModal.tsx
        │      Playground.module.css
        │      Playground.tsx
        │      PlaygroundPanel.module.css
        │      PlaygroundPanel.tsx
        │      SavePromptPopover.module.css
        │      SavePromptPopover.tsx
        │
        ├─Prompts
        │      DuplicatePromptModal.module.css
        │      DuplicatePromptModal.tsx
        │      Prompts.module.css
        │      Prompts.tsx
        │      PromptsDetail.module.css
        │      PromptsDetail.tsx
        │      PromptsNew.module.css
        │      PromptsNew.tsx
        │      PromptsReference.module.css
        │      PromptsReference.tsx
        │
        ├─Settings 
        │  │  ApiKeys.jsx
        │  │  codeSnippets.js
        │  │  CustomPagination.jsx
        │  │  General.jsx
        │  │  LLMConnections.jsx
        │  │  Members.jsx
        │  │  Models.jsx
        │  │  Scores.jsx
        │  │  SettingsPage.jsx
        │  │
        │  ├─form ## 페이지 내부 버튼 누를 시 뜨는 Modal 및 SidePanel
        │  │      DeleteForm.jsx
        │  │      DeleteProjectForm.jsx
        │  │      NewLLMConnectionsForm.jsx
        │  │      NewMemberForm.jsx
        │  │      NewModelForm.jsx
        │  │      NewScoreForm.jsx
        │  │      ToggleSwitch.jsx
        │  │      TransferProjectForm.jsx
        │  │      UpdateLLMConnectionForm.jsx
        │  │
        │  └─layout ## Settings 페이지 및 form 관련 css 폴더 
        │
        └─Tracing
                ColumnVisibilityModal.module.css
                ColumnVisibilityModal.tsx
                Sessions.module.css
                Sessions.tsx
                types.ts
```