import { Request, Response } from 'express';
import PptxGenJS from 'pptxgenjs';
import Experiment from '../models/experiment';

export const exportToPowerPoint = async (req: Request, res: Response) => {
  try {
    // Get experiment IDs from query or body (optional - if empty, export all)
    const experimentIds = req.query.ids ? (req.query.ids as string).split(',') : [];

    // Fetch experiments
    const query = experimentIds.length > 0 ? { _id: { $in: experimentIds } } : {};
    const experiments = await Experiment.find(query).sort({ createdAt: -1 });

    if (experiments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No experiments found to export'
      });
    }

    // Create PowerPoint presentation
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = 'Experiment Tracker';
    pptx.company = 'Your Company';
    pptx.subject = 'Product Feature Experiments';
    pptx.title = 'Experiment Tracker Export';

    // Title slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: '363636' };

    titleSlide.addText('Product Feature Experiments', {
      x: 0.5,
      y: 2,
      w: '90%',
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });

    titleSlide.addText(`${experiments.length} Experiment${experiments.length !== 1 ? 's' : ''}`, {
      x: 0.5,
      y: 3.5,
      w: '90%',
      h: 0.5,
      fontSize: 24,
      color: 'CCCCCC',
      align: 'center'
    });

    titleSlide.addText(new Date().toLocaleDateString(), {
      x: 0.5,
      y: 4.2,
      w: '90%',
      h: 0.3,
      fontSize: 16,
      color: '999999',
      align: 'center'
    });

    // Summary slide
    const summarySlide = pptx.addSlide();
    summarySlide.addText('Experiments Summary', {
      x: 0.5,
      y: 0.3,
      w: '90%',
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: '363636'
    });

    // Count by status
    const statusCounts = experiments.reduce((acc: any, exp) => {
      acc[exp.status] = (acc[exp.status] || 0) + 1;
      return acc;
    }, {});

    const summaryData: any[][] = [
      ['Status', 'Count'],
      ['Running', String(statusCounts.running || 0)],
      ['Completed', String(statusCounts.completed || 0)],
      ['Paused', String(statusCounts.paused || 0)],
      ['Total', String(experiments.length)]
    ];

    summarySlide.addTable(summaryData as any, {
      x: 1.5,
      y: 1.5,
      w: 7,
      h: 2.5,
      fontSize: 14,
      color: '363636',
      fill: { color: 'F5F5F5' },
      border: { pt: 1, color: 'CCCCCC' }
    });

    // Add a slide for each experiment
    experiments.forEach((experiment) => {
      const slide = pptx.addSlide();

      // Title
      slide.addText(experiment.name, {
        x: 0.5,
        y: 0.3,
        w: '90%',
        h: 0.6,
        fontSize: 28,
        bold: true,
        color: '363636'
      });

      // Status badge
      const statusColors: { [key: string]: string } = {
        running: '4CAF50',
        completed: '2196F3',
        paused: 'FFC107'
      };

      slide.addText(experiment.status.toUpperCase(), {
        x: 8.5,
        y: 0.35,
        w: 1.2,
        h: 0.4,
        fontSize: 11,
        bold: true,
        color: 'FFFFFF',
        fill: { color: statusColors[experiment.status] || '999999' },
        align: 'center'
      });

      let yPos = 1.2;

      // Basic Info
      slide.addText('Description:', {
        x: 0.5,
        y: yPos,
        w: 2,
        h: 0.3,
        fontSize: 12,
        bold: true,
        color: '666666'
      });
      slide.addText(experiment.description, {
        x: 0.5,
        y: yPos + 0.3,
        w: 9,
        h: 0.6,
        fontSize: 11,
        color: '333333'
      });
      yPos += 1.1;

      // Owner and Dates
      const detailsData: any[][] = [
        ['Owner', experiment.owner],
        ['Start Date', new Date(experiment.startDate).toLocaleDateString()],
        ['End Date', experiment.endDate ? new Date(experiment.endDate).toLocaleDateString() : 'Ongoing']
      ];

      slide.addTable(detailsData as any, {
        x: 0.5,
        y: yPos,
        w: 4.5,
        fontSize: 11,
        color: '333333',
        fill: { color: 'F9F9F9' },
        border: { pt: 1, color: 'E0E0E0' }
      });
      yPos += 1.2;

      // Hypothesis
      slide.addText('Hypothesis:', {
        x: 0.5,
        y: yPos,
        w: 2,
        h: 0.3,
        fontSize: 12,
        bold: true,
        color: '666666'
      });
      slide.addText(experiment.hypothesis, {
        x: 0.5,
        y: yPos + 0.3,
        w: 9,
        h: 0.8,
        fontSize: 11,
        color: '333333',
        valign: 'top'
      });
      yPos += 1.2;

      // Success Metrics
      if (experiment.successMetrics && experiment.successMetrics.length > 0) {
        slide.addText('Success Metrics:', {
          x: 0.5,
          y: yPos,
          w: 2,
          h: 0.3,
          fontSize: 12,
          bold: true,
          color: '666666'
        });

        experiment.successMetrics.forEach((metric, idx) => {
          slide.addText(`• ${metric}`, {
            x: 0.7,
            y: yPos + 0.3 + (idx * 0.25),
            w: 8.5,
            h: 0.25,
            fontSize: 10,
            color: '333333'
          });
        });
        yPos += 0.3 + (experiment.successMetrics.length * 0.25) + 0.2;
      }

      // Variants
      if (experiment.variants && experiment.variants.length > 0) {
        slide.addText('Variants:', {
          x: 0.5,
          y: yPos,
          w: 2,
          h: 0.3,
          fontSize: 12,
          bold: true,
          color: '666666'
        });

        const variantsData: any[][] = [
          ['Name', 'Description', 'Traffic %'],
          ...experiment.variants.map(v => [v.name, v.description, `${v.percentage}%`])
        ];

        slide.addTable(variantsData as any, {
          x: 0.5,
          y: yPos + 0.35,
          w: 9,
          fontSize: 10,
          color: '333333',
          fill: { color: 'F9F9F9' },
          border: { pt: 1, color: 'E0E0E0' }
        });
      }

      // Results and Decision (if completed)
      if (experiment.status === 'completed' && experiment.results) {
        const resultsSlide = pptx.addSlide();

        resultsSlide.addText(`${experiment.name} - Results`, {
          x: 0.5,
          y: 0.3,
          w: '90%',
          h: 0.6,
          fontSize: 24,
          bold: true,
          color: '363636'
        });

        let resultYPos = 1.2;

        if (experiment.results) {
          resultsSlide.addText('Results:', {
            x: 0.5,
            y: resultYPos,
            w: 2,
            h: 0.3,
            fontSize: 12,
            bold: true,
            color: '666666'
          });
          resultsSlide.addText(experiment.results, {
            x: 0.5,
            y: resultYPos + 0.3,
            w: 9,
            h: 1.2,
            fontSize: 11,
            color: '333333',
            valign: 'top'
          });
          resultYPos += 1.6;
        }

        if (experiment.learnings) {
          resultsSlide.addText('Learnings:', {
            x: 0.5,
            y: resultYPos,
            w: 2,
            h: 0.3,
            fontSize: 12,
            bold: true,
            color: '666666'
          });
          resultsSlide.addText(experiment.learnings, {
            x: 0.5,
            y: resultYPos + 0.3,
            w: 9,
            h: 1.2,
            fontSize: 11,
            color: '333333',
            valign: 'top'
          });
          resultYPos += 1.6;
        }

        if (experiment.decision) {
          const decisionColors: { [key: string]: string } = {
            go: '4CAF50',
            'no-go': 'F44336',
            pending: 'FFC107'
          };

          resultsSlide.addText('Decision:', {
            x: 0.5,
            y: resultYPos,
            w: 2,
            h: 0.3,
            fontSize: 12,
            bold: true,
            color: '666666'
          });

          resultsSlide.addText(experiment.decision.toUpperCase(), {
            x: 2.5,
            y: resultYPos,
            w: 1.5,
            h: 0.4,
            fontSize: 14,
            bold: true,
            color: 'FFFFFF',
            fill: { color: decisionColors[experiment.decision] || '999999' },
            align: 'center'
          });
        }
      }
    });

    // Generate PowerPoint file
    const fileName = `experiments_${new Date().toISOString().split('T')[0]}.pptx`;
    const buffer = await pptx.write({ outputType: 'nodebuffer' });

    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error exporting to PowerPoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting experiments to PowerPoint',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
